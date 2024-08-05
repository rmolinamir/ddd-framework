import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoDbUnitOfWork } from '../../mongodb-unit-of-work';
import { MongoDbUser } from './mongodb-user';

@Injectable()
export class MongoDbUserRepository {
  constructor(
    @InjectModel(MongoDbUser.name)
    private userModel: Model<MongoDbUser>
  ) {}

  public getById(anIdentity: string): Promise<MongoDbUser | null> {
    return this.userModel.findOne({ id: anIdentity }).lean();
  }

  public async getByEmail(anEmail: string): Promise<MongoDbUser | null> {
    return this.userModel.findOne({ email: anEmail }).lean();
  }

  public async save(
    user: MongoDbUser,
    unitOfWork?: MongoDbUnitOfWork
  ): Promise<MongoDbUser> {
    await this.userModel
      .updateOne({ id: user.id }, user, {
        upsert: true
      })
      .session(unitOfWork?.session || null);

    return user;
  }

  public async delete(
    user: MongoDbUser,
    unitOfWork?: MongoDbUnitOfWork
  ): Promise<MongoDbUser> {
    await this.userModel
      .deleteOne({ id: user.id })
      .session(unitOfWork?.session || null);

    return user;
  }
}
