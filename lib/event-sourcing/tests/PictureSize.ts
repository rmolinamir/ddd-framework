import { ArgumentOutOfRangeException, ValueObject } from '@ddd-framework/core';

export default class PictureSize extends ValueObject {
  public width: number;
  public height: number;

  constructor(width: number, height: number) {
    super();

    if (width <= 0)
      throw new ArgumentOutOfRangeException(
        0,
        'width',
        'Picture width must be a positive number'
      );

    if (height <= 0)
      throw new ArgumentOutOfRangeException(
        0,
        'height',
        'Picture height must be a positive number'
      );

    this.width = width;
    this.height = height;
  }

  public static Null = new PictureSize(NaN, NaN);
}
