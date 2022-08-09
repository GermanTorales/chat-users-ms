import { Inject, Injectable, Logger } from '@nestjs/common';
import { Port } from '../../domain/enums/ports';
import { IAuth, IUserRepository } from '../../domain/interfaces';
import { AuthUserDTO } from '../dtos';
import { compatePasswords } from '../helpers/user.helpers';

@Injectable()
export class AuthUser {
  private readonly logger = new Logger(AuthUser.name);

  constructor(@Inject(Port.User) private readonly userRepository: IUserRepository) {}

  async exec(data: AuthUserDTO): Promise<IAuth> {
    const { username, password } = data;
    const user = await this.userRepository.findByFilter({ username });

    if (!user) return null;

    const isMatch = await compatePasswords(user.password, password);

    if (!isMatch) return null;

    return { username, _id: user._id };
  }
}
