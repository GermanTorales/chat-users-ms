import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserNotFoundException } from '../../exceptions';
import { Port } from '../../enums';
import { UpdateUserDTO } from '../../dtos';
import { IUserRepository } from '../../repositories';
import { IUser } from '../../../application/interfaces';

@Injectable()
export class UpdateUser {
  private readonly logger = new Logger(UpdateUser.name);

  constructor(@Inject(Port.User) private readonly userRepository: IUserRepository) {}

  async exec(_id: string, data: UpdateUserDTO): Promise<IUser> {
    const userExist: IUser = await this.userRepository.findOne(_id);

    if (!userExist) throw new UserNotFoundException({ userId: _id });

    const user: IUser = await this.userRepository.update(_id, data);

    return user;
  }
}
