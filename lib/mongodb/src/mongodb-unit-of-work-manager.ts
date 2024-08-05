import { TransactionOptions } from 'mongodb';
import { Connection } from 'mongoose';
import { UnitOfWorkManager } from '@ddd-framework/core';
import { InjectConnection } from '@nestjs/mongoose';
import { MongoDbUnitOfWork } from './mongodb-unit-of-work';

export class MongoDbUnitOfWorkManager implements UnitOfWorkManager {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  public async startUnitOfWork(
    options?: TransactionOptions
  ): Promise<MongoDbUnitOfWork> {
    const session = await this.connection.startSession({
      defaultTransactionOptions: options
    });

    const unitOfWork = new MongoDbUnitOfWork(session);

    await unitOfWork.start();

    return unitOfWork;
  }
}
