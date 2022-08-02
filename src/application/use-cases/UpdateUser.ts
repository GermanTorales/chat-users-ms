import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/domain/entities';
import { Port } from 'src/domain/enums/ports';
import { IUserRepository } from '../../domain/interfaces';
import { UpdateUserDTO } from '../dtos';

@Injectable()
export class UpdateUser {
  constructor(@Inject(Port.User) private readonly userRepository: IUserRepository) {}

  async exec(_id: string, data: UpdateUserDTO): Promise<User> {
    const users = await this.userRepository.update(_id, data);

    return users;
  }
}
