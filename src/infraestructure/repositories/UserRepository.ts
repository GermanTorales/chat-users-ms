import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { User, UserDocument } from 'src/domain/entities';
import { Entities } from 'src/domain/enums/entities.enum';
import { IUserRepository } from 'src/domain/interfaces';

export class UserRepository implements IUserRepository {
  constructor(@InjectModel(Entities.User) private readonly userModel: Model<UserDocument>) {}

  async create(user: User): Promise<User> {
    return this.userModel.create(user);
  }

  async find(): Promise<User[]> {
    return this.userModel.find();
  }

  async findOne(_id: string): Promise<User> {
    return this.userModel.findOne({ _id });
  }

  async findByFilter(filter: FilterQuery<User>): Promise<User> {
    return this.userModel.findOne(filter);
  }

  async update(_id: string, data: User): Promise<any> {
    return await this.userModel.updateOne({ _id }, data, { new: true });
  }

  async delete(_id: string): Promise<void> {
    await this.userModel.deleteOne({ _id });
  }
}
