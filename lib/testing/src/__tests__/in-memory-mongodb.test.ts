import { describe, expect, test } from 'vitest';
import { InMemoryMongoDb } from '../in-memory-mongodb';

describe('InMemoryMongoDb', () => {
  describe('replica set', () => {
    const db = new InMemoryMongoDb({ type: 'replSet' });

    test('should start', async () => {
      await db.start();
      expect(db.db.state).toBe('running');
    });

    test('should close', async () => {
      await db.close();
      expect(db.db.state).not.toBe('running');
    });
  });

  describe('server', () => {
    const db = new InMemoryMongoDb({ type: 'server' });

    test('should start', async () => {
      await db.start();
      expect(db.db.state).toBe('running');
    });

    test('should close', async () => {
      await db.close();
      expect(db.db.state).not.toBe('running');
    });
  });
});
