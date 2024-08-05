import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDbUser } from './mongodb-user';
import { MongoDbUserRepository } from './mongodb-user-repository';
import { MongooseUserSchema } from './mongoose-user-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoDbUser.name, schema: MongooseUserSchema }
    ])
  ],
  providers: [
    { provide: MongoDbUserRepository, useClass: MongoDbUserRepository }
  ],
  exports: [MongoDbUserRepository]
})
export class MongoDbUserModule {}
