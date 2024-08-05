import { DateValue } from '@ddd-framework/core';
import { DataTransferObject } from '@ddd-framework/dto';
import { faker, Fixture } from '@ddd-framework/testing';
import { Uuid } from '@ddd-framework/uuid';
import { MongoDbUser } from './mongodb-user';

export const userFixture: Fixture<DataTransferObject<MongoDbUser>> = (
  overrides
) => {
  return {
    id: overrides?.id || Uuid.generate(),
    email: overrides?.email || faker.internet.email(),
    createdAt: overrides?.createdAt
      ? new DateValue(overrides.createdAt).iso()
      : DateValue.now().iso(),
    updatedAt: overrides?.updatedAt
      ? new DateValue(overrides.updatedAt).iso()
      : DateValue.now().iso()
  };
};
