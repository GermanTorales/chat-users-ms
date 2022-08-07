import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { User, UserDocument } from '../../domain/entities';
import { Entities } from '../../domain/enums/entities.enum';
import { IDeleteUser, IUserRepository } from '../../domain/interfaces';
import { ValidationFailedException } from '../exceptions/ValidationFailedException';
import { invalidDataErrorCatch } from '../helpers';

export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(@InjectModel(Entities.User) private readonly userModel: Model<UserDocument>) {}

  async create(user: User): Promise<User> {
    try {
      return await this.userModel.create(user);
    } catch (error) {
      const invalidData = invalidDataErrorCatch(error);

      if (invalidData?.isInvalid) {
        const { message, path, kind } = invalidData;

        throw new ValidationFailedException({ message, path, kind });
      }

      throw error;
    }
  }

  async find(): Promise<User[]> {
    return this.userModel.find({}).select('-password -createdAt -updatedAt -__v');
  }

  async findOne(_id: string): Promise<User> {
    return this.userModel.findOne({ _id });
  }

  async findByFilter(filter: FilterQuery<User>): Promise<User> {
    return this.userModel.findOne(filter).select('-createdAt -updatedAt -__v');
  }

  async update(_id: string, data: User): Promise<any> {
    return await this.userModel.updateOne({ _id }, data, { new: true });
  }

  async delete(_id: string): Promise<IDeleteUser> {
    return await this.userModel.deleteOne({ _id });
  }
}
