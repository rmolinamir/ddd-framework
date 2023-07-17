import { Exception } from './exception';

/**
 * The derived string of a method that produced it from another data type is invalid.
 * This typically occurs when parsing data.
 */
export class FormatException extends Exception {}
