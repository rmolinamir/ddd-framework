import Lodash from 'lodash';
import { IdentifiedDomainObject, Identity } from '../common';
import ValueObject from './ValueObject';

/**
 * Based on Vaughn Vernon's IdentifiedValueObject supertype.
 * Sometimes, because of impedance mismatch we might need to identify Value Objects to persist them.
 * > You may consider class IdentifiedValueObject as merely a marker class, a behaviorless subclass of IdentifiedDomainObject.
 */
export default abstract class IdentifiedValueObject<
    Id extends Identity = Identity
  >
  extends IdentifiedDomainObject<Id>
  implements ValueObject
{
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

  public static isValueObject(obj: unknown): obj is ValueObject {
    return obj instanceof ValueObject;
  }
}
