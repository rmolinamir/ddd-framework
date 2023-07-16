import { Uuid } from '@ddd-framework/uuid';

export default class ProductId extends Uuid {
  public static null = new ProductId(Uuid.nil);
}
