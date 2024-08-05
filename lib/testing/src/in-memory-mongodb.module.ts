import type { Connection } from 'mongoose';
import {
  DynamicModule,
  Inject,
  Module,
  OnApplicationShutdown,
  OnModuleInit,
  Provider
} from '@nestjs/common';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { InMemoryMongoDb } from './in-memory-mongodb';

@Module({})
export class InMemoryMongoDbModule
  implements OnApplicationShutdown, OnModuleInit
{
  constructor(
    @Inject(InMemoryMongoDb) private readonly inMemoryMongoDb: InMemoryMongoDb,
    @InjectConnection() private readonly connection: Connection
  ) {}

  /**
   * Configures the ConfigService NestJS module.
   * Configurations are only loaded once because the internal module is global.
   */
  public static forRoot(
    ...options: ConstructorParameters<typeof InMemoryMongoDb>
  ): DynamicModule {
    const inMemoryMongoDb = new InMemoryMongoDb(...options);

    const provider: Provider<InMemoryMongoDb> = {
      provide: InMemoryMongoDb,
      useValue: inMemoryMongoDb
    };

    return {
      module: InMemoryMongoDbModule,
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            await inMemoryMongoDb.start();
            return {
              uri: inMemoryMongoDb.db.getUri(),
              retryWrites: true
            };
          }
        })
      ],
      providers: [provider],
      exports: [provider]
    };
  }

  public async onModuleInit(): Promise<void> {
    // The following ensures that all indexes are created before the tests start.
    for (const Collection of Object.values(this.connection.collections))
      await new Promise<void>((resolve) => {
        Collection.getIndexes()
          .then(() => resolve())
          .catch(() => resolve());
      });
  }

  public async onApplicationShutdown(): Promise<void> {
    await this.inMemoryMongoDb.close();
  }
}
