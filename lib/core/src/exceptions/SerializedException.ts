/**
 * Consider adding optional `metadata` object to exceptions (if language doesn't support anything similar by default) and pass some useful technical information about the exception when throwing.
 */
export interface SerializedException {
  message: string;
  stack?: string;
  metadata?: unknown;
}
