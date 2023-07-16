import { Uuid } from '@ddd-framework/uuid';

export default class PictureId extends Uuid {
  public static readonly Null = new PictureId(Uuid.nil);
}
