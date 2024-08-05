import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InMemoryMongoDbModule } from '@ddd-framework/testing';
import { Uuid } from '@ddd-framework/uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoDbUserRepository } from './user/mongodb-user-repository';
import { MongoDbUserModule } from './user/mongodb-user.module';
import { userFixture } from './user/user-fixture';

describe('MongoDbUserRepository', () => {
  let module: TestingModule;
  let userRepository: MongoDbUserRepository;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [InMemoryMongoDbModule.forRoot(), MongoDbUserModule]
    }).compile();

    userRepository = module.get(MongoDbUserRepository);
  });

  afterEach(async () => {
    await module?.close();
  });

  describe('module', () => {
    it('userRepository should be defined', () => {
      expect(userRepository).toBeDefined();
    });
  });

  describe('writes', () => {
    it('save', async () => {
      const user = userFixture();

      await expect(userRepository.save(userFixture())).resolves.not.toThrow();

      const queriedUser = await userRepository.getById(user.id);

      expect(queriedUser).toBeDefined();
    });

    it('delete', async () => {
      const user = await userRepository.save(userFixture());

      await expect(userRepository.delete(user)).resolves.not.toThrow();

      const queriedUser = await userRepository.getById(user.id);

      expect(queriedUser).toBeNull();
    });
  });

  describe('reads', () => {
    it('getById returns User', async () => {
      const user = await userRepository.save(userFixture());

      const queriedUser = await userRepository.getById(user.id);

      expect(queriedUser).toBeDefined();
    });

    it('getById returns null', async () => {
      const queriedUser = await userRepository.getById(Uuid.generate());

      expect(queriedUser).toBeNull();
    });
  });
});
