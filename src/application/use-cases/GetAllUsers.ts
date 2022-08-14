import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from '../../domain/entities';
import { GetAllUsersDTO } from '../dtos';
import { Port } from '../enums/ports.enum';
import { IUserRepository } from '../repositories';

@Injectable()
export class GetAllUsers {
  private readonly logger = new Logger(GetAllUsers.name);

  constructor(@Inject(Port.User) private readonly userRepository: IUserRepository) {}

  async exec(queryParams: GetAllUsersDTO): Promise<User[]> {
    return await this.userRepository.find(queryParams);
  }
}
