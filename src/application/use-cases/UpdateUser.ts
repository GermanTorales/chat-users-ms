import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserNotFoundException } from '../../domain/exceptions';
import { User } from '../../domain/entities';
import { Port } from '../enums/ports.enum';
import { UpdateUserDTO } from '../dtos';
import { IUserRepository } from '../repositories';

@Injectable()
export class UpdateUser {
  private readonly logger = new Logger(UpdateUser.name);

  constructor(@Inject(Port.User) private readonly userRepository: IUserRepository) {}

  async exec(_id: string, data: UpdateUserDTO): Promise<User> {
    const userExist = await this.userRepository.findOne(_id);

    if (!userExist) throw new UserNotFoundException({ userId: _id });

    const user = await this.userRepository.update(_id, data);

    return user;
  }
}
