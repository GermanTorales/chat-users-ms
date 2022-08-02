import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/domain/entities';
import { Port } from 'src/domain/enums/ports';
import { IUserRepository } from '../../domain/interfaces';

@Injectable()
export class GetAllUsers {
  constructor(@Inject(Port.User) private readonly userRepository: IUserRepository) {}

  async exec(): Promise<User[]> {
    const users = await this.userRepository.find();

    return users;
  }
}
