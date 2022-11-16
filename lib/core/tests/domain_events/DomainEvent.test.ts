import { faker } from '@faker-js/faker';
import { DateValue, DomainEvent, Uuid } from '../../src';

describe('DomainEvent', () => {
  describe('constructor', () => {
    test('is correctly initialized', () => {
      class OrderCreated extends DomainEvent {
        public static readonly eventType = 'OrderCreated';
        public static readonly eventVersion = faker.system.semver();
      }

      const event = new OrderCreated(faker.datatype.uuid(), {
        occurredOn: DateValue.now().iso()
      });

      expect(event.eventType).toBe(OrderCreated.eventType);
      expect(event.eventVersion).toBe(OrderCreated.eventVersion);
      expect(event.metadata.occurredOn).toBeTruthy();
    });

    test('initialized without parameters', () => {
      class OrderCreated extends DomainEvent {
        public static readonly eventType = 'OrderCreated';
        public static readonly eventVersion = faker.system.semver();
      }

      const event = new OrderCreated();

      expect(event.eventType).toBe(OrderCreated.eventType);
      expect(event.eventVersion).toBe(OrderCreated.eventVersion);

      expect(event.eventId).toBeTruthy();

      expect(event.metadata.occurredOn).toBeTruthy();
      expect(event.metadata.causationId).toBeFalsy();
      expect(event.metadata.correlationId).toBeFalsy();

      expect(event.data).toBeFalsy();
    });

    test('initialized only with id', () => {
      class OrderCreated extends DomainEvent {
        public static readonly eventType = 'OrderCreated';
        public static readonly eventVersion = faker.system.semver();
      }

      const eventId = Uuid.generate();

      const event = new OrderCreated(eventId);

      expect(event.eventType).toBe(OrderCreated.eventType);
      expect(event.eventVersion).toBe(OrderCreated.eventVersion);

      expect(event.eventId).toBe(eventId);

      expect(event.metadata.occurredOn).toBeTruthy();
      expect(event.metadata.causationId).toBeFalsy();
      expect(event.metadata.correlationId).toBeFalsy();

      expect(event.data).toBeFalsy();
    });

    test('initialized only with metadata', () => {
      class OrderCreated extends DomainEvent {
        public static readonly eventType = 'OrderCreated';
        public static readonly eventVersion = faker.system.semver();
      }

      const metadata: OrderCreated['metadata'] = {
        occurredOn: DateValue.now().iso(),
        causationId: Uuid.generate(),
        correlationId: Uuid.generate()
      };

      const event = new OrderCreated(metadata);

      expect(event.eventType).toBe(OrderCreated.eventType);
      expect(event.eventVersion).toBe(OrderCreated.eventVersion);

      expect(event.eventId).toBeTruthy();

      expect(event.metadata).toMatchObject(metadata);

      expect(event.data).toBeFalsy();
    });

    test('initialized with id, and metadata', () => {
      class OrderCreated extends DomainEvent {
        public static readonly eventType = 'OrderCreated';
        public static readonly eventVersion = faker.system.semver();
      }

      const eventId = Uuid.generate();

      const metadata: OrderCreated['metadata'] = {
        occurredOn: DateValue.now().iso(),
        causationId: Uuid.generate(),
        correlationId: Uuid.generate()
      };

      const event = new OrderCreated(eventId, metadata);

      expect(event.eventType).toBe(OrderCreated.eventType);
      expect(event.eventVersion).toBe(OrderCreated.eventVersion);

      expect(event.eventId).toBe(eventId);

      expect(event.metadata).toMatchObject(metadata);

      expect(event.data).toBeFalsy();
    });

    test('initialized only with data', () => {
      type Data = {
        foo: string;
        bar: number;
        foobar: Array<string | number>;
      };

      class OrderCreated extends DomainEvent<Data> {
        public static readonly eventType = 'OrderCreated';
        public static readonly eventVersion = faker.system.semver();
      }

      const data: OrderCreated['data'] = {
        foo: faker.random.word(),
        bar: faker.datatype.number(),
        foobar: faker.datatype.array()
      };

      const event = new OrderCreated(data);

      expect(event.eventType).toBe(OrderCreated.eventType);
      expect(event.eventVersion).toBe(OrderCreated.eventVersion);

      expect(event.eventId).toBeTruthy();

      expect(event.metadata.occurredOn).toBeTruthy();
      expect(event.metadata.causationId).toBeFalsy();
      expect(event.metadata.correlationId).toBeFalsy();

      expect(event.data).toMatchObject(data);
    });

    test('initialized with metadata, and data', () => {
      type Data = {
        foo: string;
        bar: number;
        foobar: Array<string | number>;
      };

      class OrderCreated extends DomainEvent<Data> {
        public static readonly eventType = 'OrderCreated';
        public static readonly eventVersion = faker.system.semver();
      }

      const metadata: OrderCreated['metadata'] = {
        occurredOn: DateValue.now().iso(),
        causationId: Uuid.generate(),
        correlationId: Uuid.generate()
      };

      const data: OrderCreated['data'] = {
        foo: faker.random.word(),
        bar: faker.datatype.number(),
        foobar: faker.datatype.array()
      };

      const event = new OrderCreated(metadata, data);

      expect(event.eventType).toBe(OrderCreated.eventType);
      expect(event.eventVersion).toBe(OrderCreated.eventVersion);

      expect(event.eventId).toBeTruthy();

      expect(event.metadata).toMatchObject(metadata);

      expect(event.data).toMatchObject(data);
    });

    test('initialized with id, metadata, and data', () => {
      type Data = {
        foo: string;
        bar: number;
        foobar: Array<string | number>;
      };

      class OrderCreated extends DomainEvent<Data> {
        public static readonly eventType = 'OrderCreated';
        public static readonly eventVersion = faker.system.semver();
      }

      const eventId = Uuid.generate();

      const metadata: OrderCreated['metadata'] = {
        occurredOn: DateValue.now().iso(),
        causationId: Uuid.generate(),
        correlationId: Uuid.generate()
      };

      const data: OrderCreated['data'] = {
        foo: faker.random.word(),
        bar: faker.datatype.number(),
        foobar: faker.datatype.array()
      };

      const event = new OrderCreated(eventId, metadata, data);

      expect(event.eventType).toBe(OrderCreated.eventType);
      expect(event.eventVersion).toBe(OrderCreated.eventVersion);

      expect(event.eventId).toBe(eventId);

      expect(event.metadata).toMatchObject(metadata);

      expect(event.data).toMatchObject(data);
    });

    test('throws error if static property eventType is an empty string', () => {
      class OrderShipped extends DomainEvent {
        public static readonly eventType = '';
        public static readonly eventVersion = faker.system.semver();
      }

      expect(
        () =>
          new OrderShipped(faker.datatype.uuid(), {
            occurredOn: DateValue.now().iso()
          })
      ).toThrow();
    });

    test('throws error if static property eventVersion is an empty string', () => {
      class OrderShipped extends DomainEvent {
        public static readonly eventType = 'OrderShipped';
        public static readonly eventVersion = '';
      }

      expect(
        () =>
          new OrderShipped(faker.datatype.uuid(), {
            occurredOn: DateValue.now().iso()
          })
      ).toThrow();
    });

    test('throws error if static property eventType is not defined', () => {
      class OrderShipped extends DomainEvent {
        public static readonly eventVersion = faker.system.semver();
      }

      expect(
        () =>
          new OrderShipped(faker.datatype.uuid(), {
            occurredOn: DateValue.now().iso()
          })
      ).toThrow();
    });

    test('throws error if static property eventVersion is not defined', () => {
      class OrderShipped extends DomainEvent {
        public static readonly eventType = 'OrderShipped';
      }

      expect(
        () =>
          new OrderShipped(faker.datatype.uuid(), {
            occurredOn: DateValue.now().iso()
          })
      ).toThrow();
    });
  });

  describe('Register', () => {
    test('aggregateId and metadata are correctly initialized', () => {
      @DomainEvent.Register('OrderCreated', faker.system.semver())
      class OrderCreated extends DomainEvent {}

      const event = new OrderCreated(faker.datatype.uuid(), {
        occurredOn: DateValue.now().iso()
      });

      expect(event.eventType).toBe(OrderCreated.eventType);
      expect(event.eventVersion).toBe(OrderCreated.eventVersion);
      expect(event.metadata.occurredOn).toBeTruthy();
    });

    test('throws error if static property eventType is an empty string', () => {
      expect(() => {
        @DomainEvent.Register('', faker.system.semver())
        class OrderShipped extends DomainEvent {}

        return new OrderShipped(faker.datatype.uuid(), {
          occurredOn: DateValue.now().iso()
        });
      }).toThrow();
    });

    test('throws error if static property eventVersion is an empty string', () => {
      expect(() => {
        @DomainEvent.Register('OrderShipped', '')
        class OrderShipped extends DomainEvent {}

        return new OrderShipped(faker.datatype.uuid(), {
          occurredOn: DateValue.now().iso()
        });
      }).toThrow();
    });
  });

  describe('linting', () => {
    test('domain event data is correctly defined', () => {
      type Data = {
        foo: string;
        bar: number;
        foobar: Array<string | number>;
      };

      class OrderCreated extends DomainEvent<Data> {
        public static readonly eventType = 'OrderCreated';
        public static readonly eventVersion = faker.system.semver();
      }

      const event = new OrderCreated(
        faker.datatype.uuid(),
        {
          occurredOn: DateValue.now().iso()
        },
        {
          foo: faker.random.word(),
          bar: faker.datatype.number(),
          foobar: faker.datatype.array()
        }
      );

      expect(event.data.foo).toBeTruthy();
      expect(event.data.bar).toBeTruthy();
      expect(event.data.foobar).toBeInstanceOf(Array);
    });

    test('domain event data is a serialized DTO', () => {
      type Data = {
        foo: Record<string, string>;
        bar: string;
        foobar: Array<string | number>;
      };

      class OrderCreated extends DomainEvent<Data> {
        public static readonly eventType = 'OrderCreated';
        public static readonly eventVersion = faker.system.semver();
      }

      const event = new OrderCreated(
        faker.datatype.uuid(),
        {
          occurredOn: DateValue.now().iso()
        },
        {
          foo: {
            [faker.datatype.uuid()]: faker.datatype.uuid()
          },
          bar: DateValue.now().iso(),
          foobar: Array.from(new Set(faker.datatype.array()))
        }
      );

      expect(typeof event.data.foo).toBe('object');
      expect(typeof event.data.bar).toBe('string');
      expect(event.data.foobar).toBeInstanceOf(Array);
    });
  });

  describe('symbol', () => {
    test('symbol methods should work correctly', () => {
      const expectedSymbol = 'order.purchased-1.0.0';

      @DomainEvent.Register('order.purchased', '1.0.0')
      class OrderPurchased extends DomainEvent {}

      expect(
        new OrderPurchased(faker.datatype.uuid(), {
          occurredOn: DateValue.now().iso()
        }).symbol()
      ).toBe(expectedSymbol);

      expect(OrderPurchased.symbol()).toBe(expectedSymbol);
    });

    test('symbol should be guarded against empty event type', () => {
      class OrderPurchased extends DomainEvent {
        public static readonly eventType = '';
        public static readonly eventVersion = faker.system.semver();
      }

      expect(() =>
        new OrderPurchased(faker.datatype.uuid(), {
          occurredOn: DateValue.now().iso()
        }).symbol()
      ).toThrow();
      expect(() => OrderPurchased.symbol()).toThrow();
    });

    test('symbol should be guarded against empty event version', () => {
      class OrderPurchased extends DomainEvent {
        public static readonly eventType = 'order.purchased';
        public static readonly eventVersion = '';
      }

      expect(() =>
        new OrderPurchased(faker.datatype.uuid(), {
          occurredOn: DateValue.now().iso()
        }).symbol()
      ).toThrow();
      expect(() => OrderPurchased.symbol()).toThrow();
    });
  });

  describe('causation', () => {
    class OrderCreated extends DomainEvent {
      public static readonly eventType = faker.datatype.uuid();
      public static readonly eventVersion = faker.system.semver();
    }

    class OrderPurchased extends DomainEvent {
      public static readonly eventType = faker.datatype.uuid();
      public static readonly eventVersion = faker.system.semver();
    }

    test('caused by interface with id (e.g. request object)', () => {
      const request = {
        id: faker.datatype.uuid()
      };

      const causationEvent = new OrderCreated().causedBy(request);

      expect(causationEvent.metadata.causationId).toBe(request.id);
      expect(causationEvent.metadata.correlationId).toBe(request.id);
    });

    test('caused by command', () => {
      const command = {
        commandId: faker.datatype.uuid()
      };

      const causationEvent = new OrderCreated().causedBy(command);

      expect(causationEvent.metadata.causationId).toBe(command.commandId);
      expect(causationEvent.metadata.correlationId).toBe(command.commandId);
    });

    test('caused by event', () => {
      const command = {
        commandId: faker.datatype.uuid()
      };

      const causationEvent = new OrderCreated().causedBy(command);

      const event = new OrderPurchased().causedBy(causationEvent);

      expect(event.metadata.causationId).toBe(causationEvent.eventId);
      expect(event.metadata.correlationId).toBe(command.commandId);
    });

    test('sets causation and correlation defaults to causation', () => {
      const causationId = Uuid.generate();

      const event = new OrderPurchased().causedBy(causationId);

      expect(event.metadata.causationId).toBe(causationId);
      expect(event.metadata.correlationId).toBe(causationId);
    });

    test('sets causation and correlation', () => {
      const causationId = Uuid.generate();
      const correlationId = Uuid.generate();

      const event = new OrderPurchased().causedBy(causationId, correlationId);

      expect(event.metadata.causationId).toBe(causationId);
      expect(event.metadata.correlationId).toBe(correlationId);
    });

    test('sets correlation', () => {
      const causationId = Uuid.generate();
      const correlationId = Uuid.generate();

      const event = new OrderPurchased().causedBy(causationId);

      expect(event.metadata.causationId).toBe(causationId);
      expect(event.metadata.correlationId).toBe(causationId);

      event.correlatedTo(correlationId);

      expect(event.metadata.causationId).toBe(causationId);
      expect(event.metadata.correlationId).toBe(correlationId);
    });
  });
});
