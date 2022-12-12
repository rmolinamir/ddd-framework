import { Newable } from '../../../types';
import { DOMAIN_EVENT_WATERMARK } from '../constants';
import Decorator from '../Decorator';

export function isDomainEvent(Class: Newable): boolean {
  return Decorator.hasMetadata(DOMAIN_EVENT_WATERMARK, Class);
}
