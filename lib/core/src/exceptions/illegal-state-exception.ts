import { Exception } from './exception';

/**
 * Thrown when the state of an object is invalid after an improper operation or called at the wrong time.
 */
export class IllegalStateException extends Exception {}
