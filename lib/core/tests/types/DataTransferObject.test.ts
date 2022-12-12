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
        updatedAt: DateValue.null
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

  describe('Optional', () => {
    type Opportunity = {
      preferredCurrency?: CurrencyDetails;
      order?: Order;
    };

    test('Order', () => {
      const opportunity: Opportunity = {};

      const dto = serializeMock(opportunity);

      dto.preferredCurrency as DataTransferObject<CurrencyDetails> | undefined;

      if (dto.preferredCurrency) {
        expect(dto.preferredCurrency?.currencyCode as string).not.toBe(NaN);
        expect(dto.preferredCurrency?.currencySymbol as string).not.toBe(NaN);
        expect(dto.preferredCurrency?.decimalPlaces as number).not.toBe(NaN);
        expect(dto.preferredCurrency?.isCurrencyPrefix as boolean).not.toBe(
          NaN
        );
      }

      dto.order as DataTransferObject<Order> | undefined;

      if (dto.order) {
        expect(dto.order?.id as string).not.toBe(NaN);
        expect(dto.order?.status as string).not.toBe(NaN);
        expect(dto.order?.createdAt as string).not.toBe(NaN);
        expect(dto.order?.updatedAt as string).not.toBe(NaN);
      }
    });
  });
});
