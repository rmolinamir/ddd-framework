import 'reflect-metadata';

import { Identity } from '../../common';
import { IllegalStateException } from '../../exceptions';
import { ClassOf, ObjectLiteral } from '../../types';
import AggregateId from './AggregateId';
import AggregateRoot from './AggregateRoot';
import EntityId from './EntityId';
import EventSink from './EventSink';
import { isEntity } from './helpers/isEntity';

type Identifier = Identity | PropertyKey;

/**
 * Entities are not fundamentally defined by their properties, but rather by a thread
 * of continuity and identity. An object defined primarily by its identity is called
 * an Entity.
 */
export default abstract class Entity<
  DomainEvent extends ObjectLiteral = ObjectLiteral
> {
  constructor() {
    // TODO: Find a way to move these validations to the decorators.
    if (AggregateRoot.isRoot(this.constructor)) {
      if (!AggregateId.hasId(this))
        throw new IllegalStateException(
          'Aggregate roots must be identified with the @AggregateId decorator.'
        );
      else if (EntityId.hasId(this))
        throw new IllegalStateException(
          'Aggregate roots cannot be identified with the @EntityId decorator.'
        );
    } else {
      if (AggregateId.hasId(this))
        throw new IllegalStateException(
          'Non-aggregate roots Entities cannot be identified with the @AggregateId decorator.'
        );
      else if (!EntityId.hasId(this))
        throw new IllegalStateException(
          'Entity must be identified with the @EntityId decorator.'
        );
    }
  }

  /**
   * Compares two Entities for equality.
   * If both identifiers are Identity objects, then the comparison is made by the value of the identifiers.
   * Otherwise, the comparison is made by the reference of the identifiers.
   */
  public equals(anotherEntity: Entity): boolean {
    const entityId = EntityId.getId<Identifier>(this);
    const anotherEntityId = EntityId.getId<Identifier>(anotherEntity);

    return Entity.compareIdentifiers(entityId, anotherEntityId);
  }

  public notEquals(anotherEntity: Entity): boolean {
    return !this.equals(anotherEntity);
  }

  public events(): readonly DomainEvent[] {
    return EventSink.get<DomainEvent>(this);
  }

  /**
   * Clears the list of events by flushing them from the event sink.
   */
  public clearEvents(): DomainEvent[] {
    return EventSink.flush<DomainEvent>(this);
  }

  /**
   * Validates any defined invariants depending on its implementation, and raises the event.
   * The Domain Event is raised by adding it to the list of pending events of the Aggregate root in the event sink.
   * It's recommended to call this method after mutating the state of the Aggregate.
   */
  public raise(aDomainEvent: DomainEvent): void {
    if (this.validateInvariants) this.validateInvariants();

    // TODO: What if there is no AggregateRoot ID?
    // If not an aggregate root, then save the aggregate ID inside the domain event.
    if (!AggregateRoot.isRoot(this)) {
      Object.assign(this, {
        [Entity.aggregateIdSymbol]: AggregateId.getId(aDomainEvent)
      });
      AggregateId()(this, Entity.aggregateIdSymbol);
    }

    EventSink.add(aDomainEvent);
  }

  /**
   * Validates any defined invariants depending on its implementation.
   * It's an optional abstract method that, if defined, will be called before raising events.
   */
  protected validateInvariants?(): void;

  // TODO: Method decorator to validate invariants after the execution.
  // TODO: JSDocs.
  public static Invariant(): MethodDecorator {
    /**
     * This function only runs once at runtime.
     * All respective instances share the same `Class`.
     */
    return function (
      Class: ClassOf<Entity>,
      _: PropertyKey,
      descriptor: PropertyDescriptor
    ) {
      if (!isEntity(Class))
        throw new IllegalStateException(
          // TODO: Improve error message with the object's constructor name if any.
          'Cannot decorate a class that is not extending from Entity.'
        );

      const originalMethod = descriptor.value as Function;

      // TODO: Check that the decorated method is not `raise`, otherwise this causes an infinite loop.

      Object.defineProperty(descriptor, 'value', {
        value(...args: unknown[]) {
          const self = this as Entity;

          const res = originalMethod.apply(self, args);

          if (self.validateInvariants) self.validateInvariants();

          return res;
        }
      });

      return descriptor;
    } as MethodDecorator;
  }

  private static compareIdentifiers(a: Identifier, b: Identifier): boolean {
    if (a instanceof Identity && b instanceof Identity) return a.equals(b);
    else return a === b;
  }

  private static aggregateIdSymbol = Symbol('aggregateId');
}
