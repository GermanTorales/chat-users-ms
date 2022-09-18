import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserNotFoundException } from '../../exceptions';
import { Port } from '../../enums';
import { IUserRepository } from '../../repositories';
import { IUser } from '../../../application/interfaces';

@Injectable()
export class GetUser {
  private readonly logger = new Logger(GetUser.name);

  constructor(@Inject(Port.User) private readonly userRepository: IUserRepository) {}

  async exec(_id: string): Promise<IUser> {
    const user: IUser = await this.userRepository.findOne(_id);

    if (!user) throw new UserNotFoundException({ userId: _id });

    return user;
  }
}
