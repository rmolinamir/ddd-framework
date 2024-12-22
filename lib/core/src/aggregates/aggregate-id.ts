import { InvalidOperationException } from '../exceptions';
import { Decorator } from '../helpers';
import { ObjectLiteral } from '../types';

const METADATA_SYMBOL = Symbol('aggregateId:metadata');
const WATERMARK_SYMBOL = Symbol('__aggregateId__');

interface AggregateIdMetadata {
  propertyKey: PropertyKey;
}

/**
 * Decorator that marks a property as the aggregate identifier.
 */
export function AggregateId(): PropertyDecorator {
  /**
   * This function only runs once at runtime to set up the targetClass property descriptor.
   * All instances share the same `targetClass` variable.
   */
  return function (targetClass: ObjectLiteral, propertyKey: PropertyKey): void {
    const metadata: AggregateIdMetadata = { propertyKey };

    if (AggregateId.hasId(targetClass)) {
      if (AggregateId.getMetadata(targetClass)!.propertyKey !== propertyKey) {
        const name = targetClass.name || 'Object';
        throw new InvalidOperationException(
          `${name} already has an aggregate identifier.`
        );
      }
    } else {
      Decorator.setWatermark(METADATA_SYMBOL, targetClass);
      Decorator.setMetadata(WATERMARK_SYMBOL, metadata, targetClass);

      Decorator.setWatermark(METADATA_SYMBOL, targetClass.constructor);
      Decorator.setMetadata(
        WATERMARK_SYMBOL,
        metadata,
        targetClass.constructor
      );
    }
  };
}

/**
 * Returns the aggregate identifier of the object.
 */
AggregateId.getId = function <AggregateId = unknown>(
  anObject: ObjectLiteral
): AggregateId {
  if (!AggregateId.hasId(anObject)) {
    const name = anObject.name || anObject.constructor?.name || 'Object';
    throw new InvalidOperationException(
      `${name} does not have an aggregate identifier.`
    );
  }

  const metadata = AggregateId.getMetadata(anObject);

  return anObject[metadata!.propertyKey];
};

/**
 * Returns the aggregate identifier metadata of the object.
 */
AggregateId.getMetadata = function (targetClass: ObjectLiteral) {
  return Decorator.getMetadata<AggregateIdMetadata | undefined>(
    WATERMARK_SYMBOL,
    targetClass
  );
};

/**
 * Returns true if the object has an aggregate identifier.
 */
AggregateId.hasId = function (anObject: ObjectLiteral): boolean {
  return Decorator.hasMetadata(METADATA_SYMBOL, anObject);
};
