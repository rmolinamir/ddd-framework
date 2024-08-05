import { expectType } from 'tsd';
import { describe, expect, test } from 'vitest';
import { EntityCollection, List } from '@ddd-framework/collections';
import { DateValue, DomainPrimitive } from '@ddd-framework/core';
import { faker } from '@faker-js/faker';
import { CurrencyDetails } from '../../tests/currency-details';
import { Money } from '../../tests/money';
import { Order, OrderId } from '../../tests/order';
import type { DataTransferObject } from '../dto';

function serializeMock<D>(data: D): DataTransferObject<D> {
  return data as DataTransferObject<D>;
}

describe('DataTransferObject (testing the TS linter and compiler)', () => {
  describe('DomainPrimitives', () => {
    test('DateValue', () => {
      const now = DateValue.now();
      const dto = serializeMock(now);
      expectType<string>(dto);
      expect(dto as string).not.toBe(NaN);
    });

    test('Uuid', () => {
      const uuid = faker.string.uuid();
      const dto = serializeMock(uuid);
      expectType<string>(dto);
      expect(dto as string).not.toBe(NaN);
    });
  });

  describe('ValueObject', () => {
    test('Money', () => {
      const money = new Money(10, new CurrencyDetails('USD', '$', 2, true));
      const dto = serializeMock(money);
      expectType<{
        amount: number;
        currency: {
          currencyCode: string;
          currencySymbol: string;
          decimalPlaces: number;
          isCurrencyPrefix: boolean;
        };
      }>(dto);
      expect(dto.amount as number).not.toBe(NaN);
      expect(dto.currency.currencyCode as string).not.toBe(NaN);
    });
  });

  describe('AggregateRoot', () => {
    test('Order', () => {
      const order = new Order({
        id: new OrderId(faker.string.uuid()),
        status: 'PROCESSING',
        createdAt: DateValue.now(),
        updatedAt: DateValue.null
      });

      const dto = serializeMock(order);

      expectType<{
        createdAt: string;
        updatedAt: string;
        id: string;
        status: 'REQUESTED' | 'PROCESSING' | 'READY';
      }>(dto);

      order.id as DomainPrimitive<string>;
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

      expectType<
        {
          id: string;
          status: 'REQUESTED' | 'PROCESSING' | 'READY';
          createdAt: string;
          updatedAt: string;
        }[]
      >(dto);

      expect(dto as DataTransferObject<Order>[]).not.toBe(NaN);
      expect(dto[0] as DataTransferObject<Order>).not.toBe(NaN);
    });
  });

  describe('List', () => {
    test('Order', () => {
      const collection = new List<Order>();

      const dto = serializeMock(collection);

      expectType<
        {
          id: string;
          status: 'REQUESTED' | 'PROCESSING' | 'READY';
          createdAt: string;
          updatedAt: string;
        }[]
      >(dto);

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

      expectType<{
        preferredCurrency?:
          | {
              currencyCode: string;
              currencySymbol: string;
              decimalPlaces: number;
              isCurrencyPrefix: boolean;
            }
          | undefined;
        order?:
          | {
              id: string;
              status: 'REQUESTED' | 'PROCESSING' | 'READY';
              createdAt: string;
              updatedAt: string;
            }
          | undefined;
      }>(dto);

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
