import assert from 'assert';
import { ObjectLiteral } from '../../../../types';
import {
  AGGREGATE_MEMBER_METADATA,
  AGGREGATE_MEMBER_WATERMARK
} from '../../constants';
import Decorator from '../../Decorator';
import { isEntity } from '../../helpers/isEntity';
import { isEntityCollection } from '../../helpers/isEntityCollection';
import { isList } from '../../helpers/isList';
import { AggregateMemberMetadata } from './AggregateMemberMetadata';
import { getAggregateMemberMetadataOf } from './getAggregateMemberMetadataOf';
import { hasAggregateMembers } from './hasAggregateMembers';
import { setupAggregateRootReferences } from '.';
import { getAggregateRootRefOf, hasAggregateRootRef } from '../root';

export function AggregateMember(): PropertyDecorator {
  /**
   * This function only runs once at runtime to set up the targetClass property descriptor.
   * All instances share the same `targetClass` variable.
   */
  return function (targetClass: ObjectLiteral, propertyKey: PropertyKey): void {
    assert(
      isEntity(targetClass) ||
        isEntityCollection(targetClass) ||
        isList(targetClass),
      'Only an Entity, an EntityCollection, or a List can be decorated as an AggregateMember.'
    );

    if (hasAggregateMembers(targetClass)) {
      const metadata = getAggregateMemberMetadataOf(targetClass);
      metadata.propertyKeys.push(propertyKey);
    } else {
      const metadata: AggregateMemberMetadata = { propertyKeys: [propertyKey] };
      Decorator.setMetadata(AGGREGATE_MEMBER_WATERMARK, true, targetClass);
      Decorator.setMetadata(AGGREGATE_MEMBER_METADATA, metadata, targetClass);
    }

    Decorator.setAccessor(targetClass, propertyKey, {
      set(instance, aggregateMember) {
        if (
          hasAggregateRootRef(instance) &&
          !hasAggregateRootRef(aggregateMember)
        ) {
          setupAggregateRootReferences(
            getAggregateRootRefOf(instance),
            aggregateMember
          );
        }
      }
    });
  };
}
