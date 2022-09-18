import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { User } from '../../domain/entities';
import { Entities } from '../../application/enums/entities.enum';
import { IDeleteUser, IUser } from '../../application/interfaces';
import { ValidationFailedException } from '../exceptions';
import { invalidDataErrorCatch } from '../helpers';
import { IUserRepository } from '../../application/repositories';

export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(@InjectModel(Entities.User) private readonly userModel: Model<User>) {}

  async create(user: IUser): Promise<IUser> {
    try {
      const { name, username, _id } = await this.userModel.create(user);

      return { name, username, _id };
    } catch (error) {
      const invalidData = invalidDataErrorCatch(error);

      if (invalidData?.isInvalid) {
        const { message, path, kind } = invalidData;

        throw new ValidationFailedException({ message, path, kind });
      }

      throw error;
    }
  }

  async find(filter: FilterQuery<IUser>): Promise<IUser[]> {
    return this.userModel.find(filter).select('-password -createdAt -updatedAt -__v');
  }

  async findOne(_id: string): Promise<IUser> {
    return this.userModel.findOne({ _id }).select('-password -createdAt -updatedAt -__v');
  }

  async findByFilter(filter: FilterQuery<IUser>): Promise<IUser> {
    return this.userModel.findOne(filter).select('-createdAt -updatedAt -__v');
  }

  async update(_id: string, data: IUser): Promise<any> {
    return await this.userModel.findOneAndUpdate({ _id }, data, { new: true }).select('-password -createdAt -updatedAt -__v');
  }

  async delete(_id: string): Promise<IDeleteUser> {
    return await this.userModel.deleteOne({ _id });
  }
}
