import { v4 as uuidV4, validate } from 'uuid';
import { Identity } from '../common';
import { IllegalStateException } from '../exceptions';

/**
 * Universally Unique Identifier (RFC4122).
 */
export default class Uuid extends Identity<string> {
  protected validate(): void {
    if (!validate(this.value))
      throw new IllegalStateException('Invalid UUID format.');
  }

  /**
   * Returns a randomly generated v4 UUID attribute.
   */
  public static generate(options?: Parameters<typeof uuidV4>[number]): string {
    return uuidV4(options);
  }

  /**
   * Nil/Empty UUID.
   */
  protected static readonly nil = '00000000-0000-0000-0000-000000000000';
}
