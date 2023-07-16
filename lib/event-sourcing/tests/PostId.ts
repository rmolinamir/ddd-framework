import { Uuid } from '@ddd-framework/uuid';

export default class PostId extends Uuid {
  public static readonly Null = new PostId(Uuid.nil);
}
