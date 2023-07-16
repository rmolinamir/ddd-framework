import { DataTransferObject, DateValue } from '@ddd-framework/core';
import { faker } from '@faker-js/faker';

import { Command } from '../..';

describe('Command', () => {
  describe('constructor', () => {
    test('aggregateId and metadata are correctly initialized', () => {
      class CreateFakeData extends Command<string> {}

      const cmd = new CreateFakeData(
        faker.string.uuid(),
        {
          occurredOn: DateValue.now().iso()
        },
        faker.word.sample()
      );

      expect(cmd.commandId).toBeTruthy();
      expect(cmd.metadata.occurredOn).toBeTruthy();
      expect(cmd.data).toBeTruthy();
    });
  });
  describe('linting', () => {
    test('command data is correctly defined', () => {
      type Data = {
        foo: string;
        bar: number;
        foobar: Array<string | number>;
      };

      class CreateFakeData extends Command<Data> {}

      const cmd = new CreateFakeData(
        faker.string.uuid(),
        {
          occurredOn: DateValue.now().iso()
        },
        {
          foo: faker.word.sample(),
          bar: faker.number.int(),
          foobar: faker.datatype.array()
        }
      );

      expect(cmd.data.foo).toBeTruthy();
      expect(cmd.data.bar).toBeTruthy();
      expect(cmd.data.foobar).toBeInstanceOf(Array);
    });

    test('command data is a serialized DTO', () => {
      type Data = DataTransferObject<{
        foo: Map<string, string>;
        bar: Date;
        foobar: Set<string | number>;
      }>;

      class OrderCreated extends Command<Data> {
        public static readonly eventType = 'OrderCreated';
        public static readonly eventVersion = faker.system.semver();
      }

      const cmd = new OrderCreated(
        faker.string.uuid(),
        {
          occurredOn: DateValue.now().iso()
        },
        {
          foo: Object.fromEntries(
            new Map().set(faker.string.uuid(), faker.word.sample()).entries()
          ),
          bar: DateValue.now().iso(),
          foobar: Array.from(new Set(faker.datatype.array()))
        }
      );

      expect(typeof cmd.data.foo).toBe('object');
      expect(typeof cmd.data.bar).toBe('string');
      expect(cmd.data.foobar).toBeInstanceOf(Array);
    });
  });
});
