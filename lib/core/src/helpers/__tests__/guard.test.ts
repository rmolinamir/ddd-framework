import { describe, expect, test } from 'vitest';
import { faker } from '@faker-js/faker';
import { Entity, EntityId } from '../../entities';
import { Guards } from '../guards';

describe('Guards', () => {
  test('isEntity', () => {
    expect(Guards.isEntity(Entity)).toBe(true);

    class TestEntity extends Entity {
      @EntityId()
      public id: number;

      constructor(id: number) {
        super();
        this.id = id;
      }
    }

    const testEntity = new TestEntity(faker.number.int());

    expect(Guards.isEntity(testEntity)).toBe(true);
    expect(Guards.isEntity(TestEntity)).toBe(true);
    expect(Guards.isEntity({})).toBe(false);

    class ExtendedTestEntity extends TestEntity {}

    const extendedTestEntity = new ExtendedTestEntity(faker.number.int());

    expect(Guards.isEntity(extendedTestEntity)).toBe(true);
    expect(Guards.isEntity(ExtendedTestEntity)).toBe(true);
  });
});
