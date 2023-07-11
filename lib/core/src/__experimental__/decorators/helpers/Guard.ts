import { ObjectLiteral } from '../../../types';
import { List } from '../../../value_objects';
import Entity from '../Entity';
import EntityCollection from '../EntityCollection';

export class Guard {
  private constructor() {}

  // TODO: Move `isRoot` to this class?

  public static isEntity(arg: ObjectLiteral): arg is Entity {
    return this.checkIfPrototypeOf(arg, Entity.prototype);
  }

  public static isEntityCollection(
    arg: ObjectLiteral
  ): arg is EntityCollection<Entity> {
    return this.checkIfPrototypeOf(arg, EntityCollection.prototype);
  }

  public static isList(arg: ObjectLiteral): arg is List {
    return this.checkIfPrototypeOf(arg, List.prototype);
  }

  private static checkIfPrototypeOf(
    anObject: ObjectLiteral,
    prototype: ObjectLiteral
  ): boolean {
    let objectPrototype = Object.getPrototypeOf(anObject);

    while (objectPrototype) {
      if (objectPrototype === prototype) return true;
      objectPrototype = Object.getPrototypeOf(objectPrototype);
    }

    return false;
  }
}
