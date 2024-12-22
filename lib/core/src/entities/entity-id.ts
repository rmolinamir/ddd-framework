import { AggregateId, AggregateRoot } from '../aggregates';
import { InvalidOperationException } from '../exceptions';
import { Decorator } from '../helpers';
import { ObjectLiteral } from '../types';

const METADATA_SYMBOL = Symbol('entityId:metadata');
const WATERMARK_SYMBOL = Symbol('__entityId__');

interface EntityIdMetadata {
  propertyKey: PropertyKey;
}

/**
 * Decorator that marks a property as the entity identifier.
 */
export function EntityId(): PropertyDecorator {
  /**
   * This function only runs once at runtime to set up the targetClass property descriptor.
   * All instances share the same `targetClass` variable.
   */
  return function (targetClass: ObjectLiteral, propertyKey: PropertyKey): void {
    const metadata: EntityIdMetadata = { propertyKey };

    if (EntityId.hasId(targetClass)) {
      if (EntityId.getMetadata(targetClass)!.propertyKey !== propertyKey) {
        const name = targetClass.name || 'Object';
        throw new InvalidOperationException(
          `${name} already has an entity identifier.`
        );
      }
    } else {
      Decorator.setWatermark(WATERMARK_SYMBOL, targetClass);
      Decorator.setMetadata(METADATA_SYMBOL, metadata, targetClass);

      Decorator.setWatermark(WATERMARK_SYMBOL, targetClass.constructor);
      Decorator.setMetadata(METADATA_SYMBOL, metadata, targetClass.constructor);
    }
  };
}

/**
 * Returns the entity identifier of the object.
 */
EntityId.getId = function <EntityId = unknown>(
  anObject: ObjectLiteral
): EntityId {
  if (AggregateRoot.isRoot(anObject))
    return AggregateId.getId(anObject) as EntityId;

  if (!EntityId.hasId(anObject)) {
    const name = anObject.name || anObject.constructor?.name || 'Object';
    throw new InvalidOperationException(
      `${name} does not have an entity identifier.`
    );
  }

  const metadata = Decorator.getMetadata<EntityIdMetadata>(
    METADATA_SYMBOL,
    anObject
  );

  return anObject[metadata!.propertyKey];
};

/**
 * Returns the entity identifier of the object.
 */
EntityId.getMetadata = function (targetClass: ObjectLiteral) {
  return Decorator.getMetadata<EntityIdMetadata | undefined>(
    METADATA_SYMBOL,
    targetClass
  );
};

/**
 * Returns true if the object has an entity identifier.
 */
EntityId.hasId = function (anObject: ObjectLiteral): boolean {
  if (AggregateRoot.isRoot(anObject)) return AggregateId.hasId(anObject);

  return Decorator.hasMetadata(WATERMARK_SYMBOL, anObject);
};
