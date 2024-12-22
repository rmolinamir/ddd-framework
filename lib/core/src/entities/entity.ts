import 'reflect-metadata';
import { AggregateId, AggregateRoot } from '../aggregates';
import { EventSink } from '../domain-events';
import {
  IllegalStateException,
  InvalidOperationException
} from '../exceptions';
import { Guards } from '../helpers';
import { Class, ObjectLiteral } from '../types';
import { DateValue } from '../value-objects';
import { EntityId } from './entity-id';
import { Identity } from './identity';

type Identifier = Identity | PropertyKey;

/**
 * Entities are not fundamentally defined by their properties, but rather by a thread of continuity and identity.
 * An object defined primarily by its identity is called an Entity.
 */
export abstract class Entity<
  EntityEvent extends ObjectLiteral = ObjectLiteral
> {
  public createdAt?: DateValue;

  public updatedAt?: DateValue;

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

  /**
   * Compares two Entities for inequality.
   */
  public notEquals(anotherEntity: Entity): boolean {
    return !this.equals(anotherEntity);
  }

  /**
   * Returns the list of pending events of the Aggregate root in the event sink.
   */
  public events(): readonly EntityEvent[] {
    return EventSink.get<EntityEvent>(this);
  }

  /**
   * Clears the list of events by flushing them from the event sink.
   */
  public clearEvents(): EntityEvent[] {
    return EventSink.flush<EntityEvent>(this);
  }

  /**
   * Validates any defined invariants depending on its implementation, and raises the event.
   * The Domain Event is raised by adding it to the list of pending events of the Aggregate root in the event sink.
   * It's recommended to call this method after mutating the state of the Aggregate.
   */
  public raise(aDomainEvent: EntityEvent, shouldUpdateDates = true): void {
    if (this.validateInvariants) this.validateInvariants();

    // If not an aggregate root, then save the aggregate ID inside the domain event.
    if (!AggregateRoot.isRoot(this)) {
      Object.assign(this, {
        [Entity.aggregateIdSymbol]: AggregateId.getId(aDomainEvent)
      });
      AggregateId()(this, Entity.aggregateIdSymbol);
    }

    if (shouldUpdateDates) {
      if (!this.createdAt) this.createdAt = DateValue.now();
      this.updatedAt = DateValue.now();
    }

    EventSink.add(aDomainEvent, this);
  }

  /**
   * Validates any defined invariants depending on its implementation.
   * It's an optional abstract method that, if defined, will be called before raising events.
   */
  protected validateInvariants?(): void;

  /**
   * Decorator that enforces invariants for decorated class methods in TypeScript by calling `validateInvariants` before raising events.
   */
  public static Invariant(): MethodDecorator {
    /**
     * This function only runs once at runtime.
     * All respective instances share the same `Class`.
     */
    return function (
      Class: Class<Entity>,
      _: PropertyKey,
      descriptor: PropertyDescriptor
    ) {
      if (!Guards.isEntity(Class)) {
        const name = (Class as Class<unknown>).name || 'Object';
        throw new InvalidOperationException(
          `${name} is not extending from Entity.`
        );
      }

      const originalMethod = descriptor.value as Function;

      Object.defineProperty(descriptor, 'value', {
        value(...args: unknown[]) {
          const self = this as Entity;

          if (originalMethod === self.raise) {
            const name = (Class as Class<unknown>).name || 'Object';
            throw new InvalidOperationException(
              `Cannot decorate ${name}.raise with @Invariant.`
            );
          }

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
