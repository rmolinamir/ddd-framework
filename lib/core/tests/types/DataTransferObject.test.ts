import {
  DataTransferObject,
  DateValue,
  EntityCollection,
  List,
  Uuid
} from '../../src';
import CurrencyDetails from '../mocks/CurrencyDetails';
import Money from '../mocks/Money';
import Order, { OrderId } from '../mocks/Order';

function serializeMock<D>(data: D): DataTransferObject<D> {
  return data as DataTransferObject<D>;
}

describe('DataTransferObject (testing the TS linter and compiler)', () => {
  describe('DomainPrimitives', () => {
    test('DateValue', () => {
      const now = DateValue.now();
      const dto = serializeMock(now);
      expect(dto as string).not.toBe(NaN);
    });

    test('Uuid', () => {
      const uuid = Uuid.generate();
      const dto = serializeMock(uuid);
      expect(dto as string).not.toBe(NaN);
    });
  });

  describe('ValueObject', () => {
    test('Money', () => {
      const money = new Money(10, new CurrencyDetails('USD', '$', 2, true));
      const dto = serializeMock(money);
      expect(dto.amount as number).not.toBe(NaN);
      expect(dto.currency.currencyCode as string).not.toBe(NaN);
    });
  });

  describe('AggregateRoot', () => {
    test('Order', () => {
      const order = new Order({
        id: new OrderId(OrderId.generate()),
        status: 'PROCESSING',
        createdAt: DateValue.now(),
        updatedAt: DateValue.Null
      });

      const dto = serializeMock(order);

      order.id as Uuid;
      expect(dto.id as string).not.toBe(NaN);

      order.status as string;
      expect(dto.status as string).not.toBe(NaN);

      order.createdAt as DateValue;
      expect(dto.createdAt as string).not.toBe(NaN);

      order.updatedAt as DateValue | undefined;
      expect(dto.updatedAt as string | undefined).not.toBe(NaN);
    });
  });

  describe('EntityCollection', () => {
    test('Order', () => {
      const collection = new EntityCollection<Order>();

      const dto = serializeMock(collection);

      expect(dto as Record<string, DataTransferObject<Order>>).not.toBe(NaN);
      expect(dto[0] as DataTransferObject<Order>).not.toBe(NaN);
    });
  });

  describe('List', () => {
    test('Order', () => {
      const collection = new List<Order>();

      const dto = serializeMock(collection);

      expect(dto as Array<DataTransferObject<Order>>).not.toBe(NaN);
      expect(dto[0] as DataTransferObject<Order>).not.toBe(NaN);
    });
  });
});
