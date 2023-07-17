import { Exception } from './exception';

/**
 * Thrown when an operation (e.g. a method call) cannot be carried out because of the state of the object.
 */
export class InvalidOperationException extends Exception {}
