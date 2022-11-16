import { AggregateRoot, Uuid, Anemic } from '../../src';

export class OrderId extends Uuid {}

export default class Order extends AggregateRoot {
  constructor(data: Anemic<Order, 'events'>) {
    super();
    Object.assign(this, data);
  }

  public id!: OrderId;

  public status!: 'REQUESTED' | 'PROCESSING' | 'READY';
}
