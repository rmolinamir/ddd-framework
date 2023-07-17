import { Entity } from '../entities';
import { ObjectLiteral } from '../types';

/**
 * Guard helper functions.
 */
export class Guards {
  private constructor() {}

  /**
   * Returns true if the argument is an Entity.
   */
  public static isEntity(arg: ObjectLiteral): arg is Entity {
    return this.checkIfPrototypeOf(arg, Entity);
  }

  /**
   * Checks if the argument is a subclass of the prototype.
   */
  private static checkIfPrototypeOf(
    anObject: ObjectLiteral,
    prototype: Function
  ): boolean {
    if (anObject === prototype) return true;
    else if (anObject instanceof prototype) return true;
    else {
      let objectPrototype = Object.getPrototypeOf(anObject);

      while (objectPrototype) {
        if (objectPrototype === prototype) return true;
        objectPrototype = Object.getPrototypeOf(objectPrototype);
      }

      return false;
    }
  }
}
