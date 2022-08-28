import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from '../../domain/entities';
import { Port } from '../enums/ports.enum';
import { CreateUserDTO } from '../dtos';
import { UserAlreadyExistException, UserInvalidDataException } from '../../domain/exceptions';
import { encryptPassword } from '../helpers';
import { IUserRepository } from '../repositories';
import { UserPasswordException } from '../exceptions';

@Injectable()
export class CreateUser {
  private readonly logger = new Logger(CreateUser.name);

  constructor(@Inject(Port.User) private readonly userRepository: IUserRepository) {}

  async exec(data: CreateUserDTO): Promise<User> {
    try {
      const { username } = data;
      const userExist = await this.userRepository.findByFilter({ username });

      if (userExist) throw new UserAlreadyExistException({ username });

      if (data.password !== data.confirmPassword) throw new UserPasswordException('password and confirm password are not equals');

      data.password = await encryptPassword(data.password);
      const userCreated = await this.userRepository.create(data);

      return userCreated;
    } catch (error) {
      if (error instanceof UserAlreadyExistException) throw error;
      if (error instanceof UserPasswordException) throw error;

      throw new UserInvalidDataException(error);
    }
  }
}
