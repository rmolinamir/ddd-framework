import assert from 'assert';

import { ObjectLiteral } from '../../types';
import { ENTITY_ID_METADATA, ENTITY_ID_WATERMARK } from './constants';
import Decorator from './Decorator';

interface EntityIdMetadata {
  propertyKey: PropertyKey;
}

export function getEntityIdOf<EntityId = unknown>(
  anObject: ObjectLiteral
): EntityId {
  const metadata = Decorator.getMetadata(ENTITY_ID_METADATA, anObject) as
    | EntityIdMetadata
    | undefined;

  assert(metadata);

  return anObject[metadata.propertyKey];
}

export function hasEntityId(anObject: ObjectLiteral): boolean {
  return Decorator.hasMetadata(ENTITY_ID_WATERMARK, anObject);
}

export default function EntityId(): PropertyDecorator {
  /**
   * This function only runs once at runtime to set up the targetClass property descriptor.
   * All instances share the same `targetClass` variable.
   */
  return function (targetClass: ObjectLiteral, propertyKey: PropertyKey): void {
    const metadata: EntityIdMetadata = { propertyKey };

    Decorator.stampWatermark(ENTITY_ID_WATERMARK, targetClass);
    Decorator.setMetadata(ENTITY_ID_METADATA, metadata, targetClass);
  };
}
