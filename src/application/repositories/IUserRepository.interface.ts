import { User } from '../../domain/entities';
import { FilterQuery } from 'mongoose';
import { IDeleteUser } from '../interfaces';

export interface IUserRepository {
  create: (user: User) => Promise<User>;
  find: (filter: FilterQuery<User>) => Promise<User[]>;
  findOne: (_id: string) => Promise<User>;
  findByFilter: (filter: FilterQuery<User>) => Promise<User>;
  update: (_id: string, data: User) => Promise<User>;
  delete: (_id: string) => Promise<IDeleteUser>;
}
