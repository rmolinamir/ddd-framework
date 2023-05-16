import { Uuid } from '@ddd-framework/core';

export default class OrderLineId extends Uuid {
  public static null = new OrderLineId(Uuid.nil);
}
