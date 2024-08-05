import { SchemaFactory } from '@nestjs/mongoose';
import { MongoDbUser } from './mongodb-user';

export const MongooseUserSchema = SchemaFactory.createForClass(MongoDbUser);
