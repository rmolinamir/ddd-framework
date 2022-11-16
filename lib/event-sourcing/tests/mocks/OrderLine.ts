import Entity from '../../src/entities/Entity';
import * as Events from './OrderEvents';
import OrderLineId from './OrderLineId';
import ProductId from './ProductId';

export default class OrderLine extends Entity<
  OrderLineId,
  Events.OrderLineAdded
> {
  public id: OrderLineId = OrderLineId.Null;

  public productId: ProductId = ProductId.Null;

  protected when(event: Events.OrderLineAdded) {
    if (event instanceof Events.OrderLineAdded) {
      this.id = new OrderLineId(event.data.orderLineId);
      this.productId = new ProductId(event.data.orderLineProductId);
    }
  }
}
