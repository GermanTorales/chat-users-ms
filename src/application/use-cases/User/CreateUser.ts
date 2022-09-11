import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from '../../../domain/entities';
import { Port } from '../../enums/ports.enum';
import { CreateUserDTO } from '../../dtos';
import { UserAlreadyExistException, UserInvalidDataException } from '../../exceptions';
import { IUserRepository } from '../../repositories';
import { UserPasswordException } from '../../exceptions';

@Injectable()
export class CreateUser {
  private readonly logger = new Logger(CreateUser.name);

  constructor(@Inject(Port.User) private readonly userRepository: IUserRepository) {}

  async exec(data: CreateUserDTO): Promise<User> {
    try {
      const { username, password, confirmPassword } = data;

      if (await this.verifyIfUserAlreadyExist(username)) throw new UserAlreadyExistException({ username });
      if (this.comparePassword(password, confirmPassword)) throw new UserPasswordException('password and confirm password are not equals');

      const userCreated = await this.userRepository.create(data);

      return userCreated;
    } catch (error) {
      if (error instanceof UserAlreadyExistException) throw error;
      if (error instanceof UserPasswordException) throw error;

      throw new UserInvalidDataException(error);
    }
  }

  private comparePassword(password: string, confirmPassword: string): boolean {
    return password !== confirmPassword;
  }

  private async verifyIfUserAlreadyExist(username): Promise<boolean> {
    const user = await this.userRepository.findByFilter({ username });

    return Boolean(user);
  }
}
