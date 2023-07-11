import { ObjectLiteral } from '../../../types';
import { List } from '../../../value_objects';

export function isList(arg: ObjectLiteral): arg is List {
  let prototype = arg.prototype;

  while (prototype) {
    if (prototype === List.prototype) return true;
    prototype = Object.getPrototypeOf(prototype);
  }

  return false;
}
