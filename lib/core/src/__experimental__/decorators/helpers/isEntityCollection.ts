import { ObjectLiteral } from '../../../types';
import Entity from '../Entity';
import EntityCollection from '../EntityCollection';

export function isEntityCollection(
  arg: ObjectLiteral
): arg is EntityCollection<Entity> {
  let prototype = arg.prototype;

  while (prototype) {
    if (prototype === EntityCollection.prototype) return true;
    prototype = Object.getPrototypeOf(prototype);
  }

  return false;
}
