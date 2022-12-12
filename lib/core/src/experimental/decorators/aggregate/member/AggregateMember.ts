import { ObjectLiteral } from '../../../../types';
import {
  AGGREGATE_MEMBER_METADATA,
  AGGREGATE_MEMBER_WATERMARK
} from '../../constants';
import Decorator from '../../Decorator';
import { AggregateMemberMetadata } from './AggregateMemberMetadata';
import { getAggregateMemberMetadataOf } from './getAggregateMemberMetadataOf';
import { hasAggregateMember } from './hasAggregateMember';

export function AggregateMember(): PropertyDecorator {
  /**
   * This function only runs once at runtime to set up the targetClass property descriptor.
   * All instances share the same `targetClass` variable.
   */
  return function (targetClass: ObjectLiteral, propertyKey: PropertyKey): void {
    if (hasAggregateMember(targetClass)) {
      const metadata = getAggregateMemberMetadataOf(targetClass);
      metadata.propertyKeys.push(propertyKey);
    } else {
      const metadata: AggregateMemberMetadata = { propertyKeys: [propertyKey] };
      Decorator.setMetadata(AGGREGATE_MEMBER_WATERMARK, true, targetClass);
      Decorator.setMetadata(AGGREGATE_MEMBER_METADATA, metadata, targetClass);
    }
  };
}
