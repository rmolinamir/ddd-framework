import { ObjectLiteral } from '../../../types';
import Entity from '../Entity';

export function isEntity(arg: ObjectLiteral): arg is Entity {
  let prototype = Object.getPrototypeOf(arg);

  while (prototype) {
    if (prototype === Entity.prototype) return true;
    prototype = Object.getPrototypeOf(prototype);
  }

  return false;
}
