import { Uuid } from '@ddd-framework/core';

export class PostId extends Uuid {
  public static readonly Null = new PostId(Uuid.nil);
}
