import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserNotFoundException } from '../../domain/exceptions';
import { User } from '../../domain/entities';
import { Port } from '../../domain/enums/ports';
import { IUserRepository } from '../../domain/interfaces';

@Injectable()
export class GetUser {
  private readonly logger = new Logger(GetUser.name);

  constructor(@Inject(Port.User) private readonly userRepository: IUserRepository) {}

  async exec(_id: string): Promise<User> {
    this.logger.log('execute "exec" method');

    const user = await this.userRepository.findOne(_id);

    if (!user) throw new UserNotFoundException(_id);

    this.logger.log(`user with ID ${_id} found`);

    return user;
  }
}
