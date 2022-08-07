import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from '../../domain/entities';
import { Port } from '../../domain/enums/ports';
import { IUserRepository } from '../../domain/interfaces';
import { CreateUserDTO } from '../dtos';
import { UserAlreadyExistException, UserInvalidDataException } from '../../domain/exceptions';
import { encryptPassword } from '../helpers';

@Injectable()
export class CreateUser {
  private readonly logger = new Logger(CreateUser.name);

  constructor(@Inject(Port.User) private readonly userRepository: IUserRepository) {}

  async exec(data: CreateUserDTO): Promise<User> {
    try {
      const { username } = data;
      const userExist = await this.userRepository.findByFilter({ username });

      if (userExist) throw new UserAlreadyExistException({ username });

      data.password = await encryptPassword(data.password);
      const userCreated = await this.userRepository.create(data);

      return userCreated;
    } catch (error) {
      if (error instanceof UserAlreadyExistException) throw error;

      throw new UserInvalidDataException(error);
    }
  }
}
