import { Inject, Injectable } from '@nestjs/common';
import { UserNotFoundException } from '../../exceptions';
import { Port } from '../../enums';
import { IDeleteUser } from '../../interfaces';
import { IUserRepository } from '../../repositories';

@Injectable()
export class DeleteUser {
  constructor(@Inject(Port.User) private readonly userRepository: IUserRepository) {}

  async exec(_id: string): Promise<{ deleted: boolean; user: string }> {
    const user: IDeleteUser = await this.userRepository.delete(_id);

    if (!user?.deletedCount) throw new UserNotFoundException({ userId: _id });

    return { deleted: user.acknowledged, user: _id };
  }
}
