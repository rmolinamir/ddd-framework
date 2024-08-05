import mongoose from 'mongoose';
import { DataTransferObject } from '@ddd-framework/dto';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ collection: MongoDbUser.collectionName })
export class MongoDbUser {
  @Prop({
    required: true,
    unique: true,
    index: 1,
    type: mongoose.Schema.Types.String
  })
  public id!: string;

  @Prop({
    required: true,
    unique: true,
    index: 1,
    type: mongoose.Schema.Types.String
  })
  public email!: string;

  @Prop({ required: true, type: mongoose.Schema.Types.Date })
  public createdAt!: string;

  @Prop({ required: true, type: mongoose.Schema.Types.Date })
  public updatedAt!: string;

  constructor(dto: Omit<DataTransferObject<MongoDbUser>, 'events'>) {
    Object.assign(this, dto);
  }

  public static readonly collectionName = 'user';
}
