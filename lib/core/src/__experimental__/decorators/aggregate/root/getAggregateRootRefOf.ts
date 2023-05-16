import assert from 'assert';
import { ObjectLiteral } from '../../../../types';
import { AGGREGATE_ROOT_REF } from '../../constants';
import Decorator from '../../Decorator';
import { AggregateRootRef } from './AggregateRootRef';
import { isAggregateRoot } from './isAggregateRoot';
import Entity from '../../Entity';

export function getAggregateRootRefOf(
  anObject: ObjectLiteral
): AggregateRootRef {
  if (isAggregateRoot(anObject)) return { root: anObject as Entity };

  const ref = Decorator.getMetadata(AGGREGATE_ROOT_REF, anObject, {
    own: true
  }) as AggregateRootRef | undefined;

  // TODO: Implement a proper Exception
  assert(ref);

  return ref;
}
