import { Uuid } from '@ddd-framework/core';

export default class ProductId extends Uuid {
  public static null = new ProductId(Uuid.nil);
}
