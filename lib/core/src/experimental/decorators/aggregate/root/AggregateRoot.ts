import assert from 'assert';
import { ClassOf } from '../../../../types';
import { List } from '../../../../value_objects';
import { AGGREGATE_ROOT_REF, AGGREGATE_ROOT_WATERMARK } from '../../constants';
import Entity from '../../Entity';
import EntityCollection from '../../EntityCollection';
import Decorator from '../../Decorator';
import { getAggregateMemberMetadataOf, hasAggregateMember } from '../member';
import { AggregateMemberRootRef } from './getAggregateRootIdOf';

export function AggregateRoot(): ClassDecorator {
  /**
   * This function only runs once at runtime.
   * All respective instances share the same `Class`.
   */
  return function (Class: ClassOf<Entity>) {
    assert(
      Class.prototype instanceof Entity,
      'Cannot decorate a class that is not extending from Entity.'
    );

    Decorator.stampWatermark(AGGREGATE_ROOT_WATERMARK, Class);

    return class AggregateRoot extends Class {
      constructor(...args: unknown[]) {
        super(...args);

        const ref: AggregateMemberRootRef = { root: this };

        // TODO: Implement proper Exceptions
        assert(this.aggregateRootId() && this.entityId());
        assert(this.aggregateRootId() === this.entityId());

        if (hasAggregateMember(this)) {
          const memberMetadata = getAggregateMemberMetadataOf(this);

          for (const memberKey of memberMetadata.propertyKeys) {
            const aggregateMember = this[memberKey as keyof AggregateRoot];

            // TODO: Validate AggregateMember is an Entity, EntityCollection, or List.
            // If any of the above, then define a metadata reference to the Aggregate Root ID.
            Decorator.setMetadata(AGGREGATE_ROOT_REF, ref, aggregateMember);
          }
        }
      }

      public aggregateRootId<Identity>(): Identity {
        return this.entityId();
      }

      private static isEntityCollection(
        arg: unknown
      ): arg is EntityCollection<any> {
        return arg instanceof EntityCollection;
      }

      private static isList(arg: unknown): arg is List {
        return arg instanceof List;
      }
    };
  } as ClassDecorator;
}
