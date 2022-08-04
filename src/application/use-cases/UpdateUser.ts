import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserNotFoundException } from '../../domain/exceptions';
import { User } from '../../domain/entities';
import { Port } from '../../domain/enums/ports';
import { IUserRepository } from '../../domain/interfaces';
import { UpdateUserDTO } from '../dtos';

@Injectable()
export class UpdateUser {
  private readonly logger = new Logger(UpdateUser.name);

  constructor(@Inject(Port.User) private readonly userRepository: IUserRepository) {}

  async exec(_id: string, data: UpdateUserDTO): Promise<User> {
    this.logger.log('execute "exec" method');

    const userExist = await this.userRepository.findOne(_id);

    if (!userExist) throw new UserNotFoundException(_id);

    const user = await this.userRepository.update(_id, data);

    this.logger.log(`user with id ${_id} updated`);

    return user;
  }
}
