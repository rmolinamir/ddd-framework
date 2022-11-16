import { Uuid } from '@ddd-framework/core';

export default class OrderId extends Uuid {
  public static readonly Null = new OrderId(Uuid.nil);
}
