import { Identity } from '../entities';
import DomainEvent from './DomainEvent';

export default class EventSink {
  private sink: Map<ReturnType<Identity['unpack']>, DomainEvent[]> = new Map();

  private constructor() {}

  public static add<Event extends DomainEvent>(
    aggregateId: Identity,
    aDomainEvent: Event
  ): void {
    const instance = this.instance();
    const events = instance.sink.get(aggregateId.unpack());
    if (events) events.push(aDomainEvent);
    else instance.sink.set(aggregateId.unpack(), [aDomainEvent]);
  }

  /**
   * Returns all events of an Aggregate.
   */
  public static get<Event extends DomainEvent>(aggregateId: Identity): Event[] {
    return (this.instance().sink.get(aggregateId.unpack()) as Event[]) || [];
  }

  /**
   * Clears all events of an Aggregate and returns them.
   */
  public static flush<Event extends DomainEvent>(
    aggregateId: Identity
  ): Event[] {
    const instance = this.instance();
    const events = instance.sink.get(aggregateId.unpack());
    if (events) {
      instance.sink.delete(aggregateId.unpack());
      return events as Event[];
    } else return [];
  }

  private static singleton: EventSink;

  private static instance() {
    if (!EventSink.singleton) EventSink.singleton = new EventSink();
    return EventSink.singleton;
  }
}
