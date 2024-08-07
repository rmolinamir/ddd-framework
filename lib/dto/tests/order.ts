import { validate } from 'uuid';
import type { Anemic } from '@ddd-framework/core';
import {
  AggregateId,
  AggregateRoot,
  DateValue,
  Entity,
  Identity,
  IllegalStateException
} from '@ddd-framework/core';

export class OrderId extends Identity<string> {
  public validate(): void {
    if (!validate(this.value)) throw new IllegalStateException('Invalid ID.');
  }
}

@AggregateRoot()
export class Order extends Entity {
  @AggregateId()
  public id!: OrderId;

  public status!: 'REQUESTED' | 'PROCESSING' | 'READY';

  public declare createdAt: DateValue;

  public declare updatedAt: DateValue;

  constructor(data: Anemic<Order>) {
    super();
    Object.assign(this, data);
  }
}
