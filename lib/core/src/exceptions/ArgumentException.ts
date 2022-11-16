import Exception from './Exception';

/**
 * A method cannot accept a non-null parameter as input.
 */
export default class ArgumentException extends Exception {
  constructor(
    /**
     * The parameter that caused this exception.
     */
    public readonly paramName: PropertyKey,
    ...args: ConstructorParameters<typeof Exception>
  ) {
    super(...args);
  }
}
