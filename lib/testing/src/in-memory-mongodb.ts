import { MongoMemoryReplSet, MongoMemoryServer } from 'mongodb-memory-server';

export type InMemoryMongoDbOptions =
  | {
      type: 'replSet';
      options?: ConstructorParameters<typeof MongoMemoryReplSet>[number];
    }
  | {
      type: 'server';
      options?: ConstructorParameters<typeof MongoMemoryServer>[number];
    };

export class InMemoryMongoDb {
  public db: MongoMemoryServer | MongoMemoryReplSet;

  constructor({ type, options }: InMemoryMongoDbOptions = { type: 'server' }) {
    if (type === 'server') this.db = new MongoMemoryServer(options);
    else this.db = new MongoMemoryReplSet(options);
  }

  public async start(forceSamePort?: boolean | undefined): Promise<void> {
    await this.db.start(forceSamePort);
  }

  public async close(): Promise<void> {
    await this.db.stop();
  }
}
