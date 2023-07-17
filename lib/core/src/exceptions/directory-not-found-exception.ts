import { Exception } from './exception';

/**
 * This exception is thrown when a directory cannot be found or resolved, or part of it is invalid.
 */
export class DirectoryNotFoundException extends Exception {}
