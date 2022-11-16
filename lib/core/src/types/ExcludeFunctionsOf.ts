/**
 * Based on Advanced [Distributive Conditional Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html#distributive-conditional-types)
 *
 * ```ts
 * type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
 * type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;
 * type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
 * type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
 * ```
 */

type FunctionKeysOf<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

export type ExcludeFunctionsOf<T> = Omit<T, FunctionKeysOf<T>>;
