import { SerializedException } from './SerializedException';

/**
 * Exception was created out of a need for a common base class for all Node.js Error objects.
 * This class will allow you to extend and/or augment any Error by simply defining your own properties on the extended class.
 *
 * **NOTE:** Do not to include comprimising data in the `metadata` constructor parameter in production environments.
 */
export default class Exception extends Error {
  constructor(
    /**
     * Details of the exception.
     */
    public readonly message: string,
    public readonly metadata?: unknown
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Turns the exception into a Serialized object.
   */
  public toJSON(): SerializedException {
    return {
      message: this.message,
      stack: this.stack,
      metadata: this.metadata
    };
  }
}
