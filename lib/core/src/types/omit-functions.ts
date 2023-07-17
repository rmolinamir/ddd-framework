/**
 * Get the keys of an object that are functions.
 */
type Functions<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

/**
 * Omit functions of an object.
 */
export type OmitFunctions<T> = Omit<T, Functions<T>>;
