import { ObjectLiteral } from '../../../../types';
import { AGGREGATE_ROOT_REF } from '../../constants';
import Decorator from '../../Decorator';

export function hasAggregateRootId(anObject: ObjectLiteral): boolean {
  return Decorator.hasMetadata(AGGREGATE_ROOT_REF, anObject, { own: true });
}
