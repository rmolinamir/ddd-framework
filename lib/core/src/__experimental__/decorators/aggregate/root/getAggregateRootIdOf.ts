import assert from 'assert';
import { ObjectLiteral } from '../../../../types';
import { AGGREGATE_ROOT_REF } from '../../constants';
import { getEntityIdOf } from '../../EntityId';
import Decorator from '../../Decorator';
import { AggregateRootRef } from './AggregateRootRef';
import { isAggregateRoot } from './isAggregateRoot';

export function getAggregateRootIdOf<AggregateRootId = unknown>(
  anObject: ObjectLiteral
): AggregateRootId {
  if (isAggregateRoot(anObject)) return getEntityIdOf(anObject);

  const ref = Decorator.getMetadata(AGGREGATE_ROOT_REF, anObject, {
    own: true
  }) as AggregateRootRef | undefined;

  // TODO: Implement a proper Exception
  assert(ref);

  return getEntityIdOf(ref.root);
}
