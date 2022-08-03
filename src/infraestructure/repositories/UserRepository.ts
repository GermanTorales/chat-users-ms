import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { User, UserDocument } from 'src/domain/entities';
import { Entities } from 'src/domain/enums/entities.enum';
import { IUserRepository } from 'src/domain/interfaces';

export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(@InjectModel(Entities.User) private readonly userModel: Model<UserDocument>) {}

  async create(user: User): Promise<User> {
    this.logger.log('execute "create" method');

    return this.userModel.create(user);
  }

  async find(): Promise<User[]> {
    this.logger.log('execute "find" method');

    return this.userModel.find({}).select('-password -createdAt -updatedAt -__v');
  }

  async findOne(_id: string): Promise<User> {
    this.logger.log('execute "findOne" method');

    return this.userModel.findOne({ _id });
  }

  async findByFilter(filter: FilterQuery<User>): Promise<User> {
    this.logger.log('execute "findByFilter" method');

    return this.userModel.findOne(filter).select('-createdAt -updatedAt -__v');
  }

  async update(_id: string, data: User): Promise<any> {
    this.logger.log('execute "update" method');

    return await this.userModel.updateOne({ _id }, data, { new: true });
  }

  async delete(_id: string): Promise<void> {
    this.logger.log('execute "delete" method');

    await this.userModel.deleteOne({ _id });
  }
}
