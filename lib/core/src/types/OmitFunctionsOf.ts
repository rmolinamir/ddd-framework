type FunctionsOf<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

export type OmitFunctionsOf<T> = Omit<T, FunctionsOf<T>>;
