import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserNotFoundException } from '../../domain/exceptions';
import { User } from '../../domain/entities';
import { Port } from '../enums/ports.enum';
import { IUserRepository } from '../repositories';

@Injectable()
export class GetUser {
  private readonly logger = new Logger(GetUser.name);

  constructor(@Inject(Port.User) private readonly userRepository: IUserRepository) {}

  async exec(_id: string): Promise<User> {
    const user = await this.userRepository.findOne(_id);

    if (!user) throw new UserNotFoundException({ userId: _id });

    return user;
  }
}
