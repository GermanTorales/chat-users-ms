import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from '../../domain/entities';
import { Port } from '../../domain/enums/ports';
import { IUserRepository } from '../../domain/interfaces';

@Injectable()
export class GetAllUsers {
  private readonly logger = new Logger(GetAllUsers.name);

  constructor(@Inject(Port.User) private readonly userRepository: IUserRepository) {}

  async exec(): Promise<User[]> {
    this.logger.log('execute "exec" method');

    const users = await this.userRepository.find();

    this.logger.log(`users found: ${users.length}`);

    return users;
  }
}
