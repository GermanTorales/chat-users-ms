import { FilterQuery } from 'mongoose';
import { IDeleteUser, IUser } from '../interfaces';

export interface IUserRepository {
  create: (user: IUser) => Promise<IUser>;
  find: (filter: FilterQuery<IUser>) => Promise<IUser[]>;
  findOne: (_id: string) => Promise<IUser>;
  findByFilter: (filter: FilterQuery<IUser>) => Promise<IUser>;
  update: (_id: string, data: IUser) => Promise<IUser>;
  delete: (_id: string) => Promise<IDeleteUser>;
}
