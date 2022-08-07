import { User } from '../entities';
import { FilterQuery } from 'mongoose';
import { IDeleteUser } from './IUser.interface';

export interface IUserRepository {
  create: (user: User) => Promise<User>;
  find: () => Promise<User[]>;
  findOne: (_id: string) => Promise<User>;
  findByFilter: (filter: FilterQuery<User>) => Promise<User>;
  update: (_id: string, data: User) => Promise<User>;
  delete: (_id: string) => Promise<IDeleteUser>;
}
