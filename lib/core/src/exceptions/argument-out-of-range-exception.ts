import { ArgumentException } from './argument-exception';

/**
 * Thrown when a method is called with at least one argument that isn't null and contains an invalid value that doesn't belong to the expected range of values for the argument.
 */
export class ArgumentOutOfRangeException<Value> extends ArgumentException {
  constructor(
    /**
     * Identifies the invalid value.
     */
    public readonly actualValue: Value,
    ...args: ConstructorParameters<typeof ArgumentException>
  ) {
    super(...args);
  }
}
