import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities';
import { Port } from '../../domain/enums/ports';
import { IUserRepository } from '../../domain/interfaces';
import { CreateUserDTO } from '../dtos';
import { UserAlreadyExistException } from '../../domain/exceptions/UserAlreadyExistException';

@Injectable()
export class CreateUser {
  constructor(@Inject(Port.User) private readonly userRepository: IUserRepository) {}

  async exec(data: CreateUserDTO): Promise<User> {
    const { username } = data;
    const userExist = await this.userRepository.findByFilter({ username });

    if (userExist) throw new UserAlreadyExistException();

    const users = await this.userRepository.create(data);

    return users;
  }
}
