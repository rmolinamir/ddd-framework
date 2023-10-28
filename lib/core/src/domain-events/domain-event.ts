import { AggregateId } from '../aggregates';
import { EntityId } from '../entities';
import {
  IllegalStateException,
  InvalidOperationException
} from '../exceptions';
import {
  Decorator,
  DOMAIN_EVENT_METADATA,
  DOMAIN_EVENT_WATERMARK
} from '../helpers';
import { Class, ObjectLiteral } from '../types';
import { DomainEventMap } from './domain-event-map';

interface DomainEventMetadata {
  type: string | number;
  version: string | number;
}

/**
 * Decorator that marks a class as a Domain Event.
 */
export function DomainEvent(
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
  return function (Class: Class<ObjectLiteral>) {
    const metadata: DomainEventMetadata = { type, version };

    Decorator.setWatermark(DOMAIN_EVENT_WATERMARK, Class);
    Decorator.setMetadata(DOMAIN_EVENT_METADATA, metadata, Class);

    DomainEventMap.add(Class);

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
          throw new IllegalStateException('AggregateId is required.');

        if (requireEntityId && !EntityId.hasId(this))
          throw new IllegalStateException('EntityId is required.');
      }
    };
  } as ClassDecorator;
}

/**
 * Returns true if the object is a Domain Event.
 */
DomainEvent.isDomainEvent = function isDomainEvent(
  anObject: ObjectLiteral
): boolean {
  return Decorator.hasMetadata(DOMAIN_EVENT_WATERMARK, anObject);
};

/**
 * Returns the metadata of the Domain Event.
 */
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
