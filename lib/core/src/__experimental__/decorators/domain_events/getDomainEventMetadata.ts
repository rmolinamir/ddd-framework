import assert from 'assert';

import { Newable } from '../../../types';
import { DOMAIN_EVENT_METADATA } from '../constants';
import Decorator from '../Decorator';
import { DomainEventMetadata } from './DomainEventMetadata';

export function getDomainEventMetadata(
  targetClass: Newable
): DomainEventMetadata {
  const domainEventMetadata = Decorator.getMetadata<
    DomainEventMetadata | undefined
  >(DOMAIN_EVENT_METADATA, targetClass);

  // TODO: Implement a proper Exception
  assert(domainEventMetadata);

  return domainEventMetadata as DomainEventMetadata;
}
