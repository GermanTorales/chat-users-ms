import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/domain/entities';
import { Port } from 'src/domain/enums/ports';
import { IUserRepository } from '../../domain/interfaces';

@Injectable()
export class GetUser {
  constructor(@Inject(Port.User) private readonly userRepository: IUserRepository) {}

  async exec(_id: string): Promise<User> {
    const users = await this.userRepository.findOne(_id);

    return users;
  }
}
