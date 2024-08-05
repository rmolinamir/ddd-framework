import { UnitOfWorkManager } from '@ddd-framework/core';
import { Module } from '@nestjs/common';
import { MongoDbUnitOfWorkManager } from '../mongodb-unit-of-work-manager';

@Module({
  providers: [
    { provide: UnitOfWorkManager, useClass: MongoDbUnitOfWorkManager }
  ],
  exports: [UnitOfWorkManager]
})
export class MongoDbUnitOfWorkModule {}
