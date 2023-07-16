import assert from 'assert';
import _ from 'lodash';
import { v4 as uuidV4 } from 'uuid';

import { ObjectLiteral } from '../types';
import { DateValue } from '../value_objects';
import DomainEventMap from './DomainEventMap';

/**
 * Events are facts that something truly did occur in the business, they are immutable.
 * For this reason, we ought to keep Domain Objects out of our Events, because our Domain Model is mutable.
 * We can’t alter Events as our Domain Model evolves, which is why we must version our Events.
 *
 * Consider including whatever would be necessary to trigger the Event again.
 */
export default class DomainEvent<
  Data extends ObjectLiteral | void = void,
  Id extends string | number = string | number,
  Version extends string | number = string | number,
  Type extends string = string
> {
  public static readonly eventType: string;

  public static readonly eventVersion: string | number;

  public readonly eventType: Type;

  public readonly eventVersion: Version;

  public readonly eventId: Id;

  /**
   * Data that describes the event, such as the timestamp, cause, etc.
   */
  public readonly metadata: Readonly<{
    occurredOn: string;
    causationId?: string | number;
    correlationId?: string | number;
  }>;

  /**
   * The serialized intent/action of the actor.
   */
  public readonly data: Readonly<Data>;

  constructor(
    ...args: Data extends void
      ?
          | Parameters<() => void>
          | Parameters<(id: Id) => void>
          | Parameters<(metadata: DomainEvent['metadata']) => void>
          | Parameters<(id: Id, metadata: DomainEvent['metadata']) => void>
      :
          | Parameters<(data: Data) => void>
          // | Parameters<(id: Id, data: Data) => void>
          | Parameters<(metadata: DomainEvent['metadata'], data: Data) => void>
          | Parameters<
              (id: Id, metadata: DomainEvent['metadata'], data: Data) => void
            >
  ) {
    const Constructor = this.constructor as typeof DomainEvent;

    assert(
      !DomainEvent.isEmpty(Constructor.eventType),
      `[${Constructor.name}] static property "eventType" needs to be defined.`
    );

    assert(
      !DomainEvent.isEmpty(Constructor.eventVersion),
      `[${Constructor.name}] static property "eventVersion" needs to be defined.`
    );

    this.eventType = Constructor.eventType as Type;

    this.eventVersion = Constructor.eventVersion as Version;

    let eventId: Id;
    let metadata: DomainEvent['metadata'];
    let data: Data;

    const [arg1, arg2, arg3] = args;

    if (!arg1) {
      eventId = uuidV4() as Id;
      metadata = {
        occurredOn: DateValue.now().iso()
      };
      data = undefined as Data;
    } else if (arg1 && !arg2 && !arg3) {
      if (typeof arg1 === 'string' || typeof arg1 === 'number') {
        eventId = arg1 as Id;
        metadata = {
          occurredOn: DateValue.now().iso()
        };
        data = undefined as Data;
      } else if (typeof arg1 === 'object' && 'occurredOn' in arg1) {
        eventId = uuidV4() as Id;
        metadata = arg1 as DomainEvent['metadata'];
        data = undefined as Data;
      } else {
        eventId = uuidV4() as Id;
        metadata = {
          occurredOn: DateValue.now().iso()
        };
        data = arg1 as Data;
      }
    } else if (arg1 && arg2 && !arg3) {
      if (typeof arg1 === 'string' || typeof arg1 === 'number') {
        eventId = arg1 as Id;
        metadata = arg2 as DomainEvent['metadata'];
        data = undefined as Data;
      } else {
        eventId = uuidV4() as Id;
        metadata = arg1 as DomainEvent['metadata'];
        data = arg2 as Data;
      }
    } else {
      eventId = arg1 as Id;
      metadata = arg2 as DomainEvent['metadata'];
      data = arg3 as Data;
    }

    this.eventId = eventId;

    this.metadata = metadata;

    this.data = data;
  }

  /**
   * Sets the metadata `causationId` and the `correlationId`.
   * @param correlationId - defaults to `causationId`
   */
  public causedBy(event: DomainEvent): this;
  public causedBy(causation: ICausation): this;
  public causedBy(causationId: string | number, correlationId?: string): this;

  public causedBy(
    arg1: DomainEvent | ICausation | string | number,
    arg2?: string | number
  ): this {
    let causationId: string | number;
    let correlationId: string | number;

    if (typeof arg1 === 'object' && 'eventId' in arg1) {
      causationId = arg1.eventId;
      correlationId = arg1.metadata.correlationId || arg1.eventId;
    } else if (typeof arg1 === 'object' && 'commandId' in arg1) {
      causationId = arg1.commandId;
      correlationId = arg1.commandId;
    } else if (typeof arg1 === 'object' && 'id' in arg1) {
      causationId = arg1.id;
      correlationId = arg1.id;
    } else {
      causationId = arg1;
      correlationId = arg2 || arg1;
    }

    Object.assign(this.metadata, { causationId, correlationId } as Pick<
      DomainEvent['metadata'],
      'causationId' | 'correlationId'
    >);

    return this;
  }

  /**
   * Sets the metadata `correlationId`.
   */
  public correlatedTo(correlationId: string | number): this {
    Object.assign(this.metadata, { correlationId } as Pick<
      DomainEvent['metadata'],
      'correlationId'
    >);

    return this;
  }

  /**
   * A Symbol value is meant to be unique for every Domain Event.
   * Returns a composition of the event type and the event version.
   *
   * @example
   * `order.created-1.0.0`
   */
  public symbol(): `${typeof DomainEvent.eventType}-${typeof DomainEvent.eventVersion}` {
    return `${this.eventType}-${this.eventVersion}`;
  }

  /**
   * Registers the Domain Event in the Domain Event Map using its `eventType` and `eventVersion` properties as keys.
   */
  public static Register<DomainEventClass extends typeof DomainEvent>(
    eventType: DomainEvent['eventType'],
    eventVersion: DomainEvent['eventVersion'],
    disableMap = false
  ): ClassDecorator {
    return function (Class: DomainEventClass) {
      Object.assign(Class, {
        eventType,
        eventVersion
      });

      Class.guardAgainstEmptyEventMetadata();

      if (!disableMap) DomainEventMap.add(Class as typeof DomainEvent);

      return Class;
    } as ClassDecorator;
  }

  /**
   * A Symbol value is meant to be unique for every Domain Event.
   * Returns a composition of the event type and the event version.
   *
   * @example
   * `order.created-1.0.0`
   */
  public static symbol(): `${typeof DomainEvent.eventType}-${typeof DomainEvent.eventVersion}` {
    this.guardAgainstEmptyEventMetadata();
    return `${this.eventType}-${this.eventVersion}`;
  }

  private static guardAgainstEmptyEventMetadata() {
    assert(
      !this.isEmpty(this.eventType),
      `[${this.name}] "eventType" needs to be defined.`
    );

    assert(
      !this.isEmpty(this.eventVersion),
      `[${this.name}] "eventVersion" needs to be defined.`
    );
  }

  /**
   * Checks if `value` is `null`, `undefined`, `NaN`, or an empty string.
   * @param value The value to check.
   * @returns Returns `true` if `value` is nullish (i.e. empty), else `false`.
   */
  private static isEmpty(value: unknown): boolean {
    return (_.isEmpty(value) && !_.isNumber(value)) || _.isNaN(value);
  }
}

type ICausation =
  | {
      commandId: string | number;
    }
  | {
      id: string | number;
    };
