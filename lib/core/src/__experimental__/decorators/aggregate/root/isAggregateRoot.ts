import { ObjectLiteral } from '../../../../types';
import { AGGREGATE_ROOT_WATERMARK } from '../../constants';
import Decorator from '../../Decorator';

export function isAggregateRoot(anObject: ObjectLiteral): boolean {
  return Decorator.hasMetadata(AGGREGATE_ROOT_WATERMARK, anObject);
}
