import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from '../../domain/entities';
import { Port } from '../../domain/enums/ports';
import { IUserRepository } from '../../domain/interfaces';
import { CreateUserDTO } from '../dtos';
import { UserAlreadyExistException } from '../../domain/exceptions/UserAlreadyExistException';

@Injectable()
export class CreateUser {
  private readonly logger = new Logger(CreateUser.name);

  constructor(@Inject(Port.User) private readonly userRepository: IUserRepository) {}

  async exec(data: CreateUserDTO): Promise<User> {
    this.logger.log('execute "exec" method');

    const { username } = data;
    const userExist = await this.userRepository.findByFilter({ username });

    if (userExist) throw new UserAlreadyExistException();

    this.logger.log(`username ${username} available`);

    const users = await this.userRepository.create(data);

    this.logger.log('new user created');

    return users;
  }
}
