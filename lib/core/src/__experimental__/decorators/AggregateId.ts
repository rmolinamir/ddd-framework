import { InvalidOperationException } from '../../exceptions';
import { ObjectLiteral } from '../../types';
import { AGGREGATE_ID_METADATA, AGGREGATE_ID_WATERMARK } from './constants';
import Decorator from './Decorator';

interface AggregateIdMetadata {
  propertyKey: PropertyKey;
}

const watermarkSymbol = AGGREGATE_ID_WATERMARK;
const metadataSymbol = AGGREGATE_ID_METADATA;

// TODO: JSDocs.
export default function AggregateId(): PropertyDecorator {
  /**
   * This function only runs once at runtime to set up the targetClass property descriptor.
   * All instances share the same `targetClass` variable.
   */
  return function (targetClass: ObjectLiteral, propertyKey: PropertyKey): void {
    const metadata: AggregateIdMetadata = { propertyKey };

    if (AggregateId.hasId(targetClass)) {
      if (AggregateId.getMetadata(targetClass)!.propertyKey !== propertyKey)
        throw new InvalidOperationException(
          // TODO: Improve error message with the object's constructor name if any.
          'Cannot decorate a class that was already decorated with AggregateId.'
        );
    } else {
      Decorator.setWatermark(watermarkSymbol, targetClass);
      Decorator.setMetadata(metadataSymbol, metadata, targetClass);

      Decorator.setWatermark(watermarkSymbol, targetClass.constructor);
      Decorator.setMetadata(metadataSymbol, metadata, targetClass.constructor);
    }
  };
}

AggregateId.getId = function <AggregateId = unknown>(
  anObject: ObjectLiteral
): AggregateId {
  if (!AggregateId.hasId(anObject))
    throw new InvalidOperationException(
      // TODO: Improve error message with the object's constructor name if any.
      'Cannot get the identifier of an object that does not have an identifier.'
    );

  const metadata = AggregateId.getMetadata(anObject);

  return anObject[metadata!.propertyKey];
};

AggregateId.getMetadata = function (targetClass: ObjectLiteral) {
  return Decorator.getMetadata<AggregateIdMetadata | undefined>(
    metadataSymbol,
    targetClass
  );
};

AggregateId.hasId = function (anObject: ObjectLiteral): boolean {
  return Decorator.hasMetadata(watermarkSymbol, anObject);
};
