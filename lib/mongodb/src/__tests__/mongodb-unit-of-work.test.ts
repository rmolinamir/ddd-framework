import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { UnitOfWorkManager } from '@ddd-framework/core';
import { InMemoryMongoDbModule, timeout } from '@ddd-framework/testing';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoDbUnitOfWork } from '../mongodb-unit-of-work';
import { MongoDbUnitOfWorkManager } from '../mongodb-unit-of-work-manager';
import { MongoDbUnitOfWorkModule } from '../nestjs/mongodb-unit-of-work.module';
import { MongoDbUserRepository } from './user/mongodb-user-repository';
import { MongoDbUserModule } from './user/mongodb-user.module';
import { userFixture } from './user/user-fixture';

describe('MongoDbUnitOfWork', () => {
  let module: TestingModule;
  let userRepository: MongoDbUserRepository;
  let unitOfWorkManager: MongoDbUnitOfWorkManager;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        InMemoryMongoDbModule.forRoot({ type: 'replSet' }),
        MongoDbUserModule,
        MongoDbUnitOfWorkModule
      ]
    }).compile();

    /**
     * NOTE:
     *
     * The test runner creates a new database for every test module when using InMemoryMongoDb.
     * This causes a race condition. It seems like it needs time to setup the replica set, adding
     * a timeout of 500ms to the MongoDb module setup fixes the problem.
     *
     * This problem is documented in the MongoDb guidelines:
     *
     * > DANGER
     * > When not using an global instance for tests and use multi-threaded tests, it can cause Race Conditions
     * > [Source](https://nodkz.github.io/mongodb-memory-server/docs/guides/quick-start-guide/)
     *
     * Seems like it only happens on local machines so it's limited to unit tests.
     */
    await timeout(500);

    userRepository = module.get(MongoDbUserRepository);
    unitOfWorkManager = module.get(UnitOfWorkManager);
  }, 5000);

  afterEach(async () => {
    await module?.close();
  });

  describe('module', () => {
    it('userRepository should be defined', () => {
      expect(userRepository).toBeDefined();
    });

    it('unitOfWorkManager should be defined', () => {
      expect(unitOfWorkManager).toBeDefined();
    });
  });

  describe('unitOfWork API', () => {
    let unitOfWork: MongoDbUnitOfWork;

    beforeEach(async () => {
      unitOfWork = await unitOfWorkManager.startUnitOfWork();
    });

    it('start (even if redundant)', async () => {
      await expect(unitOfWork.start()).resolves.not.toThrow();
    });

    it('commit', async () => {
      const user = await userRepository.save(userFixture(), unitOfWork);

      await expect(unitOfWork.commit()).resolves.not.toThrow();

      const queriedUser = await userRepository.getById(user.id);

      expect(queriedUser).toBeDefined();
    });

    it('rollback', async () => {
      const user = await userRepository.save(userFixture(), unitOfWork);

      await expect(unitOfWork.rollback()).resolves.not.toThrow();

      const queriedUser = await userRepository.getById(user.id);

      expect(queriedUser).toBeNull();
    });

    it('two transactions in the same session is not allowed', async () => {
      const user = await userRepository.save(userFixture(), unitOfWork);

      await expect(unitOfWork.rollback()).resolves.not.toThrow();

      const nullUser = await userRepository.getById(user.id);

      expect(nullUser).toBeNull();

      await expect(
        userRepository.save(userFixture(), unitOfWork)
      ).rejects.toThrow();
    });
  });
});
