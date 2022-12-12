import assert from 'assert';
import { ObjectLiteral } from '../../../types';
import { DOMAIN_EVENT_METADATA } from '../constants';
import Decorator from '../Decorator';
import { DomainEventMetadata } from './DomainEventMetadata';

export function getDomainEventMetadata(
  target: ObjectLiteral
): DomainEventMetadata {
  const domainEventMetadata = Decorator.getMetadata<
    DomainEventMetadata | undefined
  >(DOMAIN_EVENT_METADATA, target);

  // TODO: Implement a proper Exception
  assert(domainEventMetadata);

  return domainEventMetadata as DomainEventMetadata;
}
