import { Exception } from './exception';

/**
 * 	Thrown when an operation's allowed time to complete has passed.
 */
export class TimeoutException extends Exception {}
