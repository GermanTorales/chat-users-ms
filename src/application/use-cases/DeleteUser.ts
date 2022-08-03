import { Inject, Injectable } from '@nestjs/common';
import { Port } from '../../domain/enums/ports';
import { IUserRepository } from '../../domain/interfaces';

@Injectable()
export class DeleteUser {
  constructor(@Inject(Port.User) private readonly userRepository: IUserRepository) {}

  async exec(_id: string): Promise<void> {
    const users = await this.userRepository.delete(_id);

    return users;
  }
}
