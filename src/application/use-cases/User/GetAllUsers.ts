import { Inject, Injectable, Logger } from '@nestjs/common';
import { IUser } from '../../../application/interfaces';
import { GetAllUsersDTO } from '../../dtos';
import { Port } from '../../enums';
import { IUserRepository } from '../../repositories';

@Injectable()
export class GetAllUsers {
  private readonly logger = new Logger(GetAllUsers.name);

  constructor(@Inject(Port.User) private readonly userRepository: IUserRepository) {}

  async exec(queryParams: GetAllUsersDTO): Promise<IUser[]> {
    return await this.userRepository.find(queryParams);
  }
}
