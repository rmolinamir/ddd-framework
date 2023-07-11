import { InvalidOperationException } from '../../exceptions';
import { ObjectLiteral } from '../../types';
import AggregateId from './AggregateId';
import AggregateRoot from './AggregateRoot';
import { ENTITY_ID_METADATA, ENTITY_ID_WATERMARK } from './constants';
import Decorator from './Decorator';

interface EntityIdMetadata {
  propertyKey: PropertyKey;
}

const watermarkSymbol = ENTITY_ID_WATERMARK;
const metadataSymbol = ENTITY_ID_METADATA;

// TODO: JSDocs.
export default function EntityId(): PropertyDecorator {
  /**
   * This function only runs once at runtime to set up the targetClass property descriptor.
   * All instances share the same `targetClass` variable.
   */
  return function (targetClass: ObjectLiteral, propertyKey: PropertyKey): void {
    const metadata: EntityIdMetadata = { propertyKey };

    if (EntityId.hasId(targetClass)) {
      if (EntityId.getMetadata(targetClass)!.propertyKey !== propertyKey)
        throw new InvalidOperationException(
          // TODO: Improve error message with the object's constructor name if any.
          'Cannot decorate a class that was already decorated with EntityId.'
        );
    } else {
      Decorator.setWatermark(watermarkSymbol, targetClass);
      Decorator.setMetadata(metadataSymbol, metadata, targetClass);

      Decorator.setWatermark(watermarkSymbol, targetClass.constructor);
      Decorator.setMetadata(metadataSymbol, metadata, targetClass.constructor);
    }
  };
}

EntityId.getId = function <EntityId = unknown>(
  anObject: ObjectLiteral
): EntityId {
  if (AggregateRoot.isRoot(anObject))
    return AggregateId.getId(anObject) as EntityId;

  if (!EntityId.hasId(anObject))
    throw new InvalidOperationException(
      // TODO: Improve error message with the object's constructor name if any.
      'Cannot get the identifier of an object that does not have an identifier.'
    );

  const metadata = Decorator.getMetadata<EntityIdMetadata>(
    metadataSymbol,
    anObject
  );

  return anObject[metadata!.propertyKey];
};

EntityId.getMetadata = function (targetClass: ObjectLiteral) {
  return Decorator.getMetadata<EntityIdMetadata | undefined>(
    metadataSymbol,
    targetClass
  );
};

EntityId.hasId = function (anObject: ObjectLiteral): boolean {
  if (AggregateRoot.isRoot(anObject)) return AggregateId.hasId(anObject);

  return Decorator.hasMetadata(watermarkSymbol, anObject);
};
