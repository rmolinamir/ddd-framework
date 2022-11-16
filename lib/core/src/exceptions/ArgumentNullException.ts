import ArgumentException from './ArgumentException';

/**
 * When a method is called and at least one of the provided arguments (which should never be null) is null.
 */
export default class ArgumentNullException extends ArgumentException {}
