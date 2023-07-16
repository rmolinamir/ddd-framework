import { Uuid } from '@ddd-framework/uuid';

export default class OrderId extends Uuid {
  public static readonly null = new OrderId(Uuid.nil);
}
