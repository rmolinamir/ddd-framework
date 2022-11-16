export interface ClassOf<Type = any, ConstructorArgs extends unknown[] = any[]>
  extends Function {
  new (...args: ConstructorArgs): Type;
}
