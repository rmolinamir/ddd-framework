import {
  AggregateId,
  AggregateRoot,
  Anemic,
  DateValue,
  Entity,
  Identity,
  IllegalStateException
} from '@ddd-framework/core';
import { validate } from 'uuid';

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

  public createdAt!: DateValue;

  public updatedAt!: DateValue;

  constructor(data: Anemic<Order>) {
    super();
    Object.assign(this, data);
  }
}
