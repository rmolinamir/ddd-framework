import assert from 'assert';

import { ClassOf } from '../../../../types';
import { AGGREGATE_ROOT_WATERMARK } from '../../constants';
import Decorator from '../../Decorator';
import Entity from '../../Entity';
import { AggregateRootRef } from './AggregateRootRef';
import { setupAggregateRootReferences } from './setupAggregateRootReferences';

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

    class AggregateRoot extends Class {
      constructor(...args: unknown[]) {
        super(...args);

        Decorator.stampWatermark(AGGREGATE_ROOT_WATERMARK, this);

        setupAggregateRootReferences({ root: this } as AggregateRootRef, this);
      }

      public aggregateRootId<Identity>(): Identity {
        return this.entityId();
      }
    }

    return AggregateRoot;
  } as ClassDecorator;
}
