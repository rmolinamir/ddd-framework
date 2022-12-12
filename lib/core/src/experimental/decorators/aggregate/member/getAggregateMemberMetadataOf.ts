import assert from 'assert';
import { ObjectLiteral } from '../../../../types';
import { AGGREGATE_MEMBER_METADATA } from '../../constants';
import Decorator from '../../Decorator';
import { AggregateMemberMetadata } from './AggregateMemberMetadata';

export function getAggregateMemberMetadataOf(
  anObject: ObjectLiteral
): AggregateMemberMetadata {
  const metadata = Decorator.getMetadata(
    AGGREGATE_MEMBER_METADATA,
    anObject
  ) as AggregateMemberMetadata | undefined;

  // TODO: Implement a proper Exception
  assert(metadata);

  return metadata as AggregateMemberMetadata;
}
