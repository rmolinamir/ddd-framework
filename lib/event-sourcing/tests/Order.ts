import assert from 'assert';

import { AggregateRoot } from '../src';
import Address from './Address';
import * as Events from './OrderEvents';
import OrderId from './OrderId';
import OrderLine from './OrderLine';
import OrderLineId from './OrderLineId';
import { OrderState } from './OrderState';
import ProductId from './ProductId';

export default class Order extends AggregateRoot<OrderId, Events.OrderEvents> {
  public id: OrderId = OrderId.null;

  public state: OrderState = OrderState.Null;

  public orderLines: OrderLine[] = [];

  public billingAddress: Address = Address.Null;

  public shippingAddress: Address = Address.Null;

  public create(anId: OrderId): void {
    this.apply(
      new Events.OrderCreated({
        orderId: anId.unpack()
      })
    );
  }

  public restart(): void {
    this.apply(
      new Events.OrderReset({
        orderId: this.id.unpack()
      })
    );
  }

  public addOrderLine(anOrderLineId: OrderLineId, aProductId: ProductId): void {
    this.apply(
      new Events.OrderLineAdded({
        orderId: this.id.unpack(),
        orderLineId: anOrderLineId.unpack(),
        orderLineProductId: aProductId.unpack()
      })
    );
  }

  public removeOrderLine(anOrderLineId: OrderLineId): void {
    this.apply(
      new Events.OrderLineRemoved({
        orderId: this.id.unpack(),
        orderLineId: anOrderLineId.unpack()
      })
    );
  }

  public setShippingAddress(anAddress: Address): void {
    this.apply(
      new Events.ShippingAddressSet({
        orderId: this.id.unpack(),
        country: anAddress.country,
        city: anAddress.city,
        street: anAddress.street,
        zipCode: anAddress.zipCode
      })
    );
  }

  public setBillingAddress(anAddress: Address): void {
    this.apply(
      new Events.BillingAddressSet({
        orderId: this.id.unpack(),
        country: anAddress.country,
        city: anAddress.city,
        street: anAddress.street,
        zipCode: anAddress.zipCode
      })
    );
  }

  public place(): void {
    this.apply(
      new Events.OrderPlaced({
        orderId: this.id.unpack()
      })
    );
  }

  public ship(): void {
    this.apply(
      new Events.OrderShipped({
        orderId: this.id.unpack()
      })
    );
  }

  public deliver(): void {
    this.apply(
      new Events.OrderSentForDelivery({
        orderId: this.id.unpack()
      })
    );
  }

  public markOrderAsDelivered(): void {
    this.apply(
      new Events.OrderDelivered({
        orderId: this.id.unpack()
      })
    );
  }

  protected validateInvariants(): void {
    switch (this.state) {
      case OrderState.Null: {
        this.id.equals(OrderId.null);
        assert(this.orderLines.length === 0);
        break;
      }
      case OrderState.Shopping: {
        assert(this.id.notEquals(OrderId.null));
        break;
      }
      case OrderState.Placed:
      case OrderState.Shipped:
      case OrderState.OutForDelivery:
      case OrderState.Delivered: {
        assert(this.id.notEquals(OrderId.null));
        assert(this.billingAddress.notEquals(Address.Null));
        assert(this.shippingAddress.notEquals(Address.Null));
        assert(this.orderLines.length > 0);
        break;
      }
    }
  }

  protected when(event: Events.OrderEvents): void {
    if (event instanceof Events.OrderCreated) {
      this.id = new OrderId(event.data.orderId);
      this.state = OrderState.Shopping;
    } else if (event instanceof Events.OrderReset) {
      this.orderLines = [];
      this.state = OrderState.Shopping;
    } else if (event instanceof Events.OrderLineAdded) {
      const orderLine = new OrderLine(this.apply);
      this.applyOnEntity(event, orderLine);
      this.orderLines.push(orderLine);
    } else if (event instanceof Events.OrderLineRemoved) {
      const removedOrderLineId = new OrderLineId(event.data.orderLineId);
      this.orderLines = this.orderLines.filter((orderLine) =>
        orderLine.id.notEquals(removedOrderLineId)
      );
    } else if (event instanceof Events.ShippingAddressSet) {
      this.shippingAddress = new Address(
        event.data.country,
        event.data.city,
        event.data.street,
        event.data.zipCode
      );
    } else if (event instanceof Events.BillingAddressSet) {
      this.billingAddress = new Address(
        event.data.country,
        event.data.city,
        event.data.street,
        event.data.zipCode
      );
    } else if (event instanceof Events.OrderPlaced) {
      this.state = OrderState.Placed;
    } else if (event instanceof Events.OrderShipped) {
      this.state = OrderState.Shipped;
    } else if (event instanceof Events.OrderSentForDelivery) {
      this.state = OrderState.OutForDelivery;
    } else if (event instanceof Events.OrderDelivered) {
      this.state = OrderState.Delivered;
    }
  }
}
