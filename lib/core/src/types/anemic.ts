import { OmitFunctions } from './omit-functions';

/**
 * Converts a generic type into an anemic type by excluding any methods.
 * Useful for object/class initializers or data-centric operations.
 */
export type Anemic<Type, OmittedKeys extends keyof Type = never> = Omit<
  {
    [Key in keyof OmitFunctions<Type>]: Type[Key];
  },
  OmittedKeys
>;
