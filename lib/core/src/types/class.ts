/**
 * Type of a class.
 */
export interface Class<Type = any, ConstructorArgs extends unknown[] = any[]>
  extends Function {
  new (...args: ConstructorArgs): Type;
}
