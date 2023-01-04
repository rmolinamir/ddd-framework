import { ObjectLiteral } from '../../../../types';
import { AGGREGATE_ROOT_REF } from '../../constants';
import Decorator from '../../Decorator';
import { isEntity } from '../../helpers/isEntity';
import { isEntityCollection } from '../../helpers/isEntityCollection';
import { isList } from '../../helpers/isList';
import { AggregateRootRef } from './AggregateRootRef';
import { getAggregateMemberMetadataOf } from '../member/getAggregateMemberMetadataOf';
import { hasAggregateMembers } from '../member/hasAggregateMembers';

/**
 * Recursively point the Aggregate Members to their Aggregate Root.
 */
export function setupAggregateRootReferences(
  aggregateRootRef: AggregateRootRef,
  anObject: ObjectLiteral
) {
  Decorator.setMetadata(AGGREGATE_ROOT_REF, aggregateRootRef, anObject);

  if (hasAggregateMembers(anObject)) {
    const memberMetadata = getAggregateMemberMetadataOf(anObject);

    for (const memberKey of memberMetadata.propertyKeys) {
      const aggregateMember = anObject[memberKey];

      if (isEntity(aggregateMember)) {
        Decorator.setMetadata(
          AGGREGATE_ROOT_REF,
          aggregateRootRef,
          aggregateMember
        );
      } else if (isEntityCollection(aggregateMember)) {
        Decorator.setMetadata(
          AGGREGATE_ROOT_REF,
          aggregateRootRef,
          aggregateMember
        );

        aggregateMember.forEach((e) => {
          setupAggregateRootReferences(aggregateRootRef, e);
        });
      } else if (isList(aggregateMember)) {
        Decorator.setMetadata(
          AGGREGATE_ROOT_REF,
          aggregateRootRef,
          aggregateMember
        );

        aggregateMember.forEach((e) => {
          if (isEntity(e)) setupAggregateRootReferences(aggregateRootRef, e);
        });
      } else {
        console.warn(
          `The Aggregate root reference was set up, but the aggregate member of constructor {${aggregateMember.constructor.name}} is not supported.`
        );
      }

      setupAggregateRootReferences(aggregateRootRef, aggregateMember);
    }
  }
}
