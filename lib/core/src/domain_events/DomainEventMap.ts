import { InvalidOperationException } from '../exceptions';
import DomainEvent from './DomainEvent';

/**
 * Singleton that maps DomainEvent classes when registered.
 * Used to deserialize events by retrieving the respective DomainEvent class using the type and version metadata of a serialized object.
 */
export default class DomainEventMap {
  private static singleton: DomainEventMap;

  private map: Record<
    DomainEvent['eventType'],
    Record<DomainEvent['eventVersion'], typeof DomainEvent>
  > = {};

  private constructor() {}

  public static add(aDomainEventClass: typeof DomainEvent): void {
    const instance = this.instance();
    if (!instance.map[aDomainEventClass.eventType])
      instance.map[aDomainEventClass.eventType] = {};
    if (
      !instance.map[aDomainEventClass.eventType][aDomainEventClass.eventVersion]
    )
      instance.map[aDomainEventClass.eventType][
        aDomainEventClass.eventVersion
      ] = aDomainEventClass;
    else
      throw new InvalidOperationException(
        `Domain Event of type [${aDomainEventClass.eventType}] and version [${aDomainEventClass.eventVersion}] was already added.`
      );
  }

  public static get<Event extends typeof DomainEvent>(
    eventType: DomainEvent['eventType'],
    eventVersion: DomainEvent['eventVersion']
  ): Event | undefined {
    const instance = this.instance();
    return instance.map[eventType]
      ? (instance.map[eventType][eventVersion] as Event)
      : undefined;
  }

  private static instance() {
    if (!DomainEventMap.singleton)
      DomainEventMap.singleton = new DomainEventMap();
    return DomainEventMap.singleton;
  }
}
