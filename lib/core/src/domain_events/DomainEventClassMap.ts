import { InvalidOperationException } from '../exceptions';
import { ClassOf } from '../types';
import DomainEvent from './DomainEvent';

type DomainEventMetadataIndexes = Pick<
  DomainEvent,
  'eventType' | 'eventVersion'
>;

type Unpack<T> = T extends (infer U)[] ? U : never;

type KeyedByDomainEventMetadata<T extends DomainEventMetadataIndexes[]> = {
  [Type in Unpack<T>['eventType']]: {
    [Version in Unpack<T>['eventVersion']]: Extract<
      Unpack<T>,
      { eventType: Type; eventVersion: Version }
    >;
  };
};

type DomainEventClass<Event extends DomainEvent = DomainEvent> =
  ClassOf<Event> & DomainEventMetadataIndexes;

export interface IDomainEventClassMap<
  DomainEventClasses extends DomainEventClass[]
> {
  getDomainEventClassBy(
    aDomainEventMetadata: DomainEventMetadataIndexes
  ): Unpack<DomainEventClasses> | null;
}

class __DomainEventClassMap<DomainEventClasses extends DomainEventClass[]>
  implements IDomainEventClassMap<DomainEventClasses>
{
  constructor(...domainEventClasses: DomainEventClasses) {
    this.setup(...domainEventClasses);
  }

  private setup(...domainEventClasses: DomainEventClasses): void {
    domainEventClasses.forEach(async (event) => {
      const self = this as Record<PropertyKey, any>;

      const eventType =
        event.eventType as keyof KeyedByDomainEventMetadata<DomainEventClasses>;

      const eventVersion =
        event.eventVersion as keyof KeyedByDomainEventMetadata<DomainEventClasses>;

      if (!self[eventType]) self[eventType] = {};

      if (!self[eventType][eventVersion]) self[eventType][eventVersion] = event;
      else
        throw new InvalidOperationException(
          `A duplicated event of type "${eventType}" and version "${eventVersion}" was found. Check that your event type and version combinations are unique.`
        );
    });
  }

  public getDomainEventClassBy({
    eventType,
    eventVersion
  }: DomainEventMetadataIndexes): Unpack<DomainEventClasses> | null {
    const self = this as Record<PropertyKey, any>;

    const event = (self[eventType] && self[eventType][eventVersion]) || null;

    return event as Unpack<DomainEventClasses> | null;
  }
}

type DomainEventClassMap = new <
  DomainEventClasses extends ConstructorParameters<typeof __DomainEventClassMap>
>(
  ...domainEventClasses: DomainEventClasses
) => IDomainEventClassMap<DomainEventClasses> &
  KeyedByDomainEventMetadata<DomainEventClasses>;

const DomainEventClassMap = __DomainEventClassMap as DomainEventClassMap;

export default DomainEventClassMap;
