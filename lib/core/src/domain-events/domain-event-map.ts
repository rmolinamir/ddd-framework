import { InvalidOperationException } from '../exceptions';
import { Class, ObjectLiteral } from '../types';
import { DomainEvent } from './domain-event';

type EventType = string | number;
type EventVersion = string | number;

/**
 * Singleton that maps DomainEvent classes when registered.
 * Used to deserialize events by retrieving the respective DomainEvent class using the type and version metadata of a serialized object.
 */
export class DomainEventMap {
  private static singleton: DomainEventMap;

  private map: Record<EventType, Record<EventVersion, Class<ObjectLiteral>>> =
    {};

  private constructor() {}

  /**
   * Adds a DomainEvent class to the map.
   */
  public static add(aDomainEventClass: Class<ObjectLiteral>): void {
    const instance = this.instance();

    if (!DomainEvent.isDomainEvent(aDomainEventClass))
      throw new InvalidOperationException(
        `Class [${aDomainEventClass.name}] is not a Domain Event.`
      );

    const { type, version } = DomainEvent.getMetadata(aDomainEventClass);

    if (!instance.map[type]) instance.map[type] = {};

    if (!instance.map[type][version])
      instance.map[type][version] = aDomainEventClass;
    else
      throw new InvalidOperationException(
        `Domain Event [${aDomainEventClass.name}] with type [${type}] and version [${version}] already registered.`
      );
  }

  /**
   * Returns a DomainEvent class from the map.
   */
  public static get<Event extends Class<ObjectLiteral>>(
    eventType: EventType,
    eventVersion: EventVersion
  ): Event | undefined {
    const instance = this.instance();

    return instance.map[eventType]
      ? (instance.map[eventType][eventVersion] as Event)
      : undefined;
  }

  /**
   * Returns the singleton instance of the DomainEventMap.
   */
  private static instance() {
    if (!DomainEventMap.singleton)
      DomainEventMap.singleton = new DomainEventMap();
    return DomainEventMap.singleton;
  }
}
