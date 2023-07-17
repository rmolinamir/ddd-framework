import { ArgumentException } from './argument-exception';

/**
 * When a method is called and at least one of the provided arguments (which should never be null) is null.
 */
export class ArgumentNullException extends ArgumentException {}
