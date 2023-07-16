import { Uuid } from '@ddd-framework/uuid';

export default class OrderLineId extends Uuid {
  public static null = new OrderLineId(Uuid.nil);
}
