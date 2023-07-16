import { OmitFunctionsOf } from './OmitFunctionsOf';

/**
 * Converts a generic type into an anemic type by excluding any methods.
 * Useful for object/class initializers or data-centric operations.
 */
export type Anemic<Type, OmittedKeys extends keyof Type = never> = Omit<
  {
    [Key in keyof OmitFunctionsOf<Type>]: Type[Key];
  },
  OmittedKeys
>;
