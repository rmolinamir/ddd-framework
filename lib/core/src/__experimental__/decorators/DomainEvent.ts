import {
  IllegalStateException,
  InvalidOperationException
} from '../../exceptions';
import { ClassOf, ObjectLiteral } from '../../types';
import AggregateId from './AggregateId';
import { DOMAIN_EVENT_METADATA, DOMAIN_EVENT_WATERMARK } from './constants';
import Decorator from './Decorator';
import DomainEventMap from './DomainEventMap';
import EntityId from './EntityId';

interface DomainEventMetadata {
  type: string | number;
  version: string | number;
}

// TODO: JSDocs.
export default function DomainEvent(
  type: DomainEventMetadata['type'],
  version: DomainEventMetadata['version'],
  options: Partial<{
    requireAggregateId: boolean;
    requireEntityId: boolean;
  }> = {}
): ClassDecorator {
  const { requireAggregateId = true, requireEntityId = false } = options;

  /**
   * This function only runs once at runtime.
   * All respective instances share the same `Class`.
   */
  return function (Class: ClassOf<ObjectLiteral>) {
    const metadata: DomainEventMetadata = { type, version };

    Decorator.setWatermark(DOMAIN_EVENT_WATERMARK, Class);
    Decorator.setMetadata(DOMAIN_EVENT_METADATA, metadata, Class);

    DomainEventMap.add(Class);

    const hasAggregateId = AggregateId.hasId(Class);
    const hasEntityId = EntityId.hasId(Class);

    console.log('hasAggregateId: ', hasAggregateId);
    console.log('hasEntityId: ', hasEntityId);

    return class extends Class {
      constructor(...args: unknown[]) {
        super(...args);

        Object.defineProperty(this.constructor, 'name', {
          value: Class.name,
          configurable: false,
          enumerable: false,
          writable: false
        });

        Decorator.setWatermark(DOMAIN_EVENT_WATERMARK, this);
        Decorator.setMetadata(DOMAIN_EVENT_METADATA, metadata, this);

        if (requireAggregateId && !AggregateId.hasId(this))
          throw new IllegalStateException(`TODO: Description`);

        if (requireEntityId && !EntityId.hasId(this))
          throw new IllegalStateException(`TODO: Description`);

        console.log('hasAggregateId: ', hasAggregateId);
        console.log('hasEntityId: ', hasEntityId);
      }
    };
  } as ClassDecorator;
}

DomainEvent.isDomainEvent = function isDomainEvent(
  anObject: ObjectLiteral
): boolean {
  return Decorator.hasMetadata(DOMAIN_EVENT_WATERMARK, anObject);
};

DomainEvent.getMetadata = function getMetadata(
  anObject: ObjectLiteral
): DomainEventMetadata {
  if (!DomainEvent.isDomainEvent(anObject))
    throw new InvalidOperationException(
      'Cannot get the metadata of an object that is not a Domain Event.'
    );

  const domainEventMetadata = Decorator.getMetadata<DomainEventMetadata>(
    DOMAIN_EVENT_METADATA,
    anObject
  );

  return domainEventMetadata;
};
