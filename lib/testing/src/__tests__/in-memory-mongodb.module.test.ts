import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryMongoDb } from '../in-memory-mongodb';
import { InMemoryMongoDbModule } from '../in-memory-mongodb.module';

describe('InMemoryMongoDbModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [InMemoryMongoDbModule.forRoot()]
    }).compile();
  });

  afterEach(async () => {
    await module.close();
    expect(module.get(InMemoryMongoDb).db.state).not.toBe('running');
  });

  test('should be defined', () => {
    expect(module.get(InMemoryMongoDb)).toBeInstanceOf(InMemoryMongoDb);
  });

  test('should be running', () => {
    expect(module.get(InMemoryMongoDb).db.state).toBe('running');
  });
});
