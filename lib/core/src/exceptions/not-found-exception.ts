import { Exception } from './exception';

/**
 * Thrown when a client-requested resource could not be located on the server.
 */
export class NotFoundException extends Exception {}
