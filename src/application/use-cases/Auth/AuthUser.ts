import { Inject, Injectable, Logger } from '@nestjs/common';
import { Port } from '../../enums';
import { IAuth, IUser } from '../../interfaces';
import { AuthUserDTO } from '../../dtos';
import { comparePasswords } from '../../helpers';
import { IUserRepository } from '../../repositories';

@Injectable()
export class AuthUser {
  private readonly logger = new Logger(AuthUser.name);

  constructor(@Inject(Port.User) private readonly userRepository: IUserRepository) {}

  async exec(data: AuthUserDTO): Promise<IAuth> {
    const { username, password } = data;
    const user: IUser = await this.userRepository.findByFilter({ username });

    if (!user) return null;

    const isMatch = await comparePasswords(user.password, password);

    if (!isMatch) return null;

    return { username, _id: user._id };
  }
}
