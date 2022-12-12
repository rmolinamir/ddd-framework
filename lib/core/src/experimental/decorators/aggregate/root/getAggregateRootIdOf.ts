import assert from 'assert';
import { ObjectLiteral } from '../../../../types';
import { AGGREGATE_ROOT_REF } from '../../constants';
import Entity from '../../Entity';
import { getEntityIdOf } from '../../EntityId';
import Decorator from '../../Decorator';

export interface AggregateMemberRootRef {
  root: Entity;
}

export function getAggregateRootIdOf<AggregateRootId = unknown>(
  anObject: ObjectLiteral
): AggregateRootId {
  const ref = Decorator.getMetadata(AGGREGATE_ROOT_REF, anObject, {
    own: true
  }) as AggregateMemberRootRef | undefined;

  // TODO: Implement a proper Exception
  assert(ref);

  return getEntityIdOf(ref.root);
}
