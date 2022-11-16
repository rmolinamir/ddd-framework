import 'reflect-metadata';
import { ObjectLiteral } from '../../types';

export default function AggregateIdentifier(): PropertyDecorator {
  /**
   * This function only runs once at runtime to set up the targetClass property descriptor.
   * In this case, we are basically setting up a setter, getter, and a private backing field property.
   *
   * NOTE:
   *
   * - All instances share the same `targetClass` variable, and it refers to the `Thing` class.
   * - The `this` keyword inside the getters and setters will refer the instances of `Thing`.
   */
  return function (targetClass: ObjectLiteral, propertyKey: PropertyKey): void {
    Reflect.defineMetadata(AggregateIdentifier.name, propertyKey, targetClass);
  };
}
