import { Uuid } from '@ddd-framework/core';

export default class PictureId extends Uuid {
  public static readonly Null = new PictureId(Uuid.nil);
}
