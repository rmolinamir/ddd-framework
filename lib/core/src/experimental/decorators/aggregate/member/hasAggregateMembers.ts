import { ObjectLiteral } from '../../../../types';
import { AGGREGATE_MEMBER_WATERMARK } from '../../constants';
import Decorator from '../../Decorator';

export function hasAggregateMembers(anObject: ObjectLiteral): boolean {
  return Decorator.hasMetadata(AGGREGATE_MEMBER_WATERMARK, anObject);
}
