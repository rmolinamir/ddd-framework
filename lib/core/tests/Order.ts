import { validate } from 'uuid';

import { AggregateRoot, Anemic, Identity, IllegalStateException } from '../src';

export class OrderId extends Identity<string> {
  public validate(): void {
    if (!validate(this.value)) throw new IllegalStateException('Invalid ID.');
  }
}
export default class Order extends AggregateRoot {
  constructor(data: Anemic<Order>) {
    super();
    Object.assign(this, data);
  }

  public id!: OrderId;

  public status!: 'REQUESTED' | 'PROCESSING' | 'READY';
}
