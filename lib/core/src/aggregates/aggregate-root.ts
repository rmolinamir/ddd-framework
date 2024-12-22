import { Entity } from '../entities';
import { InvalidOperationException } from '../exceptions';
import { Decorator, Guards } from '../helpers';
import { Class, ObjectLiteral } from '../types';

const WATERMARK_SYMBOL = Symbol('__aggregateRoot__');

/**
 * Decorator that marks a class as an aggregate root.
 */
export function AggregateRoot(): ClassDecorator {
  /**
   * This function only runs once at runtime.
   * All respective instances share the same `Class`.
   */
  return function (Class: Class<Entity>) {
    if (!Guards.isEntity(Class)) {
      const name = (Class as Class<unknown>).name || 'Object';
      throw new InvalidOperationException(
        `${name} is not extending from Entity.`
      );
    }

    Decorator.setWatermark(WATERMARK_SYMBOL, Class);

    return class extends Class {
      constructor(...args: unknown[]) {
        super(...args);

        Object.defineProperty(this.constructor, 'name', {
          value: Class.name,
          configurable: false,
          enumerable: false,
          writable: false
        });

        Decorator.setWatermark(WATERMARK_SYMBOL, this);
      }
    };
  } as ClassDecorator;
}

/**
 * Returns true if the object is an aggregate root.
 */
AggregateRoot.isRoot = function isAggregateRoot(
  anObject: ObjectLiteral
): boolean {
  return Decorator.hasMetadata(WATERMARK_SYMBOL, anObject);
};
