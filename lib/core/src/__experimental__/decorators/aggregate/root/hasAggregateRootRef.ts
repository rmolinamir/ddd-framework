import { ObjectLiteral } from '../../../../types';
import { AGGREGATE_ROOT_REF } from '../../constants';
import Decorator from '../../Decorator';
import { isAggregateRoot } from './isAggregateRoot';

export function hasAggregateRootRef(anObject: ObjectLiteral): boolean {
  if (isAggregateRoot(anObject)) return true;
  else
    return Decorator.hasMetadata(AGGREGATE_ROOT_REF, anObject, { own: true });
}
