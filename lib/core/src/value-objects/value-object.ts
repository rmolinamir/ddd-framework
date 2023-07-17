import Lodash from 'lodash';

/**
 * When you care only about the attributes of an element of the model, classify it as a ValueObject.
 *
 * Aim to:
 *
 * - Make it express the meaning of the attributes it conveys and give it related functionality.
 * - Treat the ValueObject as immutable.
 * - Don’t give it any identity and avoid the design complexities necessary to maintain Entities.
 */
export abstract class ValueObject {
  /**
   * Determines if the Values are considered equal by comparing the types of both objects and then their attributes.
   * Returns `true` if both the types and their attributes are equal.
   */
  public equals(object: ValueObject): boolean {
    const typesAreEqual = this.constructor === object.constructor;
    if (!typesAreEqual) return false;
    else return Lodash.isEqual(this, object);
  }

  /**
   * Inverse of the `equals` method.
   */
  public notEquals(object: ValueObject): boolean {
    return !this.equals(object);
  }

  /**
   * Returns true if the argument is a ValueObject.
   */
  public static isValueObject(obj: unknown): obj is ValueObject {
    return obj instanceof ValueObject;
  }
}
