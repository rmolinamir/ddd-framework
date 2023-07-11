import 'reflect-metadata';

import assert from 'assert';

import { ClassOf, ObjectLiteral } from '../../types';
import { AGGREGATE_ROOT_WATERMARK } from './constants';
import Decorator from './Decorator';
import Entity from './Entity';
import { isEntity } from './helpers/isEntity';

// TODO: JSDocs.
export default function AggregateRoot(): ClassDecorator {
  /**
   * This function only runs once at runtime.
   * All respective instances share the same `Class`.
   */
  return function (Class: ClassOf<Entity>) {
    // TODO: User proper exceptions.
    assert(
      isEntity(Class),
      'Cannot decorate a class that is not extending from Entity.'
    );

    Decorator.setWatermark(AGGREGATE_ROOT_WATERMARK, Class);

    return class extends Class {
      constructor(...args: unknown[]) {
        super(...args);

        Object.defineProperty(this.constructor, 'name', {
          value: Class.name,
          configurable: false,
          enumerable: false,
          writable: false
        });

        Decorator.setWatermark(AGGREGATE_ROOT_WATERMARK, this);
      }
    };
  } as ClassDecorator;
}

AggregateRoot.isRoot = function isAggregateRoot(
  anObject: ObjectLiteral
): boolean {
  return Decorator.hasMetadata(AGGREGATE_ROOT_WATERMARK, anObject);
};
