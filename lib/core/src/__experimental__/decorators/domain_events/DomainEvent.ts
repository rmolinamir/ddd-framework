import { ObjectLiteral } from '../../../types';
import { DOMAIN_EVENT_METADATA, DOMAIN_EVENT_WATERMARK } from '../constants';
import Decorator from '../Decorator';
import { DomainEventMetadata } from './DomainEventMetadata';

export function DomainEvent(
  type: DomainEventMetadata['type'],
  version: DomainEventMetadata['version']
): ClassDecorator {
  /**
   * This function only runs once at runtime.
   * All respective instances share the same `Class`.
   */
  return (anObject: ObjectLiteral) => {
    const metadata: DomainEventMetadata = { type, version };

    Decorator.stampWatermark(DOMAIN_EVENT_WATERMARK, anObject);
    Decorator.setMetadata(DOMAIN_EVENT_METADATA, metadata, anObject);
  };
}
