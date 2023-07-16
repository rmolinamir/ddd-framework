import { faker } from '@faker-js/faker';

import Address from '../../../tests/Address';
import Order from '../../../tests/Order';
import * as Events from '../../../tests/OrderEvents';
import OrderId from '../../../tests/OrderId';
import OrderLineId from '../../../tests/OrderLineId';
import { OrderState } from '../../../tests/OrderState';
import ProductId from '../../../tests/ProductId';

describe('AggregateRoot', () => {
  test('handles event and sets changes', () => {
    const order = new Order();

    order.create(new OrderId(OrderId.generate()));

    const changes = order.getChanges();

    expect(changes).toHaveLength(1);
    expect(changes[0]).toBeInstanceOf(Events.OrderCreated);
  });

  test('increases aggregate version', () => {
    const order = new Order();

    expect(order.version).toBe(0);

    order.create(new OrderId(OrderId.generate()));

    expect(order.version).toBe(1);
  });

  test('clear changes', () => {
    const order = new Order();

    order.create(new OrderId(OrderId.generate()));

    expect(order.getChanges()).toHaveLength(1);

    order.clearChanges();

    expect(order.getChanges()).toHaveLength(0);
  });

  test('load aggregate from event stream', () => {
    const orderId = new OrderId(OrderId.generate());
    const orderLineId = new OrderLineId(faker.string.uuid());

    const stream: Events.OrderEvents[] = [
      new Events.OrderCreated({
        orderId: orderId.unpack()
      }),
      new Events.OrderLineAdded({
        orderId: orderId.unpack(),
        orderLineId: orderLineId.unpack(),
        orderLineProductId: faker.string.uuid()
      }),
      new Events.OrderLineAdded({
        orderId: orderId.unpack(),
        orderLineId: faker.string.uuid(),
        orderLineProductId: faker.string.uuid()
      }),
      new Events.OrderLineAdded({
        orderId: orderId.unpack(),
        orderLineId: faker.string.uuid(),
        orderLineProductId: faker.string.uuid()
      }),
      new Events.OrderLineRemoved({
        orderId: orderId.unpack(),
        orderLineId: faker.string.uuid()
      }),
      new Events.ShippingAddressSet({
        orderId: orderId.unpack(),
        country: faker.location.country(),
        city: faker.location.city(),
        street: faker.location.streetAddress(),
        zipCode: faker.location.zipCode()
      }),
      new Events.BillingAddressSet({
        orderId: orderId.unpack(),
        country: faker.location.country(),
        city: faker.location.city(),
        street: faker.location.streetAddress(),
        zipCode: faker.location.zipCode()
      }),
      new Events.OrderPlaced({
        orderId: orderId.unpack()
      }),
      new Events.OrderShipped({
        orderId: orderId.unpack()
      }),
      new Events.OrderSentForDelivery({
        orderId: orderId.unpack()
      }),
      new Events.OrderDelivered({
        orderId: orderId.unpack()
      })
    ];

    const order = new Order();

    order.load(stream);

    expect(order.id.equals(orderId)).toBe(true);

    expect(order.orderLines).toHaveLength(3);

    expect(
      order.orderLines.find(({ id }) => id.equals(orderLineId))
    ).toBeTruthy();

    expect(order.billingAddress.notEquals(order.shippingAddress)).toBe(true);

    expect(order.version).toBe(11); // Starts at 0, increases 1 per event.
  });

  describe('Order', () => {
    test('instantiates to null', () => {
      const order = new Order();

      expect(order.id).toBe(OrderId.null);
      expect(order.state).toBe(OrderState.Null);
      expect(order.orderLines).toHaveLength(0);
      expect(order.billingAddress).toBe(Address.Null);
      expect(order.shippingAddress).toBe(Address.Null);
    });

    test('full order command flow', () => {
      const address = new Address(
        faker.location.country(),
        faker.location.city(),
        faker.location.streetAddress(),
        faker.location.zipCode()
      );

      const order = new Order();

      order.create(new OrderId(OrderId.generate()));

      order.addOrderLine(
        new OrderLineId(faker.string.uuid()),
        new ProductId(faker.string.uuid())
      );
      order.addOrderLine(
        new OrderLineId(faker.string.uuid()),
        new ProductId(faker.string.uuid())
      );
      order.addOrderLine(
        new OrderLineId(faker.string.uuid()),
        new ProductId(faker.string.uuid())
      );

      expect(order.orderLines).toHaveLength(3);

      const removedOrderLine = order.orderLines[0];

      expect(order.orderLines).toContain(removedOrderLine);

      order.removeOrderLine(removedOrderLine.id);

      expect(order.orderLines).not.toContain(removedOrderLine);
      expect(order.orderLines).toHaveLength(2);

      order.setShippingAddress(address);

      order.setBillingAddress(address);

      order.place();

      order.ship();

      order.deliver();

      order.markOrderAsDelivered();

      const changes = order.getChanges();

      expect(changes).toHaveLength(11); // Called once per command.
      expect(changes[0]).toBeInstanceOf(Events.OrderCreated);
      expect(changes[1]).toBeInstanceOf(Events.OrderLineAdded);
      expect(changes[2]).toBeInstanceOf(Events.OrderLineAdded);
      expect(changes[3]).toBeInstanceOf(Events.OrderLineAdded);
      expect(changes[4]).toBeInstanceOf(Events.OrderLineRemoved);
      expect(changes[5]).toBeInstanceOf(Events.ShippingAddressSet);
      expect(changes[6]).toBeInstanceOf(Events.BillingAddressSet);
      expect(changes[7]).toBeInstanceOf(Events.OrderPlaced);
      expect(changes[8]).toBeInstanceOf(Events.OrderShipped);
      expect(changes[9]).toBeInstanceOf(Events.OrderSentForDelivery);
      expect(changes[10]).toBeInstanceOf(Events.OrderDelivered);

      expect(order.version).toBe(11); // Starts at 0, increases 1 per event.
    });
  });

  test('invariants are validated', () => {
    const order = new Order();

    order.create(new OrderId(OrderId.generate()));
    order.addOrderLine(
      new OrderLineId(faker.string.uuid()),
      new ProductId(faker.string.uuid())
    );

    expect(() => order.place()).toThrow();
  });
});
