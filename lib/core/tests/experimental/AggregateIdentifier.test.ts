import { faker } from '@faker-js/faker';
import { DomainEvent, IllegalStateException } from '../../src';
import AggregateIdentifier from '../../src/experimental/decorators/AggregateIdentifier';
import DomainEventDecorator from '../../src/experimental/decorators/DomainEvent';

describe('AggregateIdentifier', () => {
  // class OrderCancelled extends DomainEvent<{
  //   orderId: string;
  // }> {
  //   public static readonly eventType = 'OrderCreated';
  //   public static readonly eventVersion = faker.system.semver();

  //   public orderId: string = faker.datatype.uuid();
  // }

  test('reflection API', () => {
    class OrderCreated extends DomainEvent {
      public static readonly eventType = 'OrderCreated';
      public static readonly eventVersion = faker.system.semver();

      @AggregateIdentifier()
      public orderId: string = faker.datatype.uuid();
    }

    const orderCreated = new OrderCreated();

    expect(
      Reflect.hasMetadata(AggregateIdentifier.name, orderCreated)
    ).toBeTruthy();

    expect(
      Reflect.getMetadata(AggregateIdentifier.name, orderCreated)
    ).toBeTruthy();

    const aggregateIdKey = Reflect.getMetadata(
      AggregateIdentifier.name,
      orderCreated
    );

    expect(orderCreated[aggregateIdKey as keyof OrderCreated]).toBe(
      orderCreated.orderId
    );
  });

  test('DomainEventV2', () => {
    class DomainEventV2 {
      // IDK

      constructor() {
        if (!Reflect.hasMetadata(AggregateIdentifier.name, this))
          throw new IllegalStateException(
            'DomainEvent needs an AggregateIdentifier.'
          );
      }
    }

    expect(() => new DomainEventV2()).toThrow();

    // TODO: could even do a class decorator instead of extending class
    class GiftStollenByTheGrinch extends DomainEventV2 {
      @AggregateIdentifier()
      public readonly giftId: string = faker.datatype.uuid();
    }

    expect(() => new GiftStollenByTheGrinch()).not.toThrow();
  });

  test('DomainEventDecorator', () => {
    @DomainEventDecorator()
    class GiftStollenByTheGrinch {
      @AggregateIdentifier()
      public readonly giftId: string = faker.datatype.uuid();
    }

    // const isClassIdentified = Reflect.hasMetadata(
    //   AggregateIdentifier.name,
    //   GiftStollenByTheGrinch
    // );

    const isInstanceIdentified = Reflect.hasMetadata(
      AggregateIdentifier.name,
      new GiftStollenByTheGrinch()
    );

    // expect(isClassIdentified).toBeTruthy();
    expect(isInstanceIdentified).toBeTruthy();

    expect(() => new GiftStollenByTheGrinch()).not.toThrow();
  });
});
