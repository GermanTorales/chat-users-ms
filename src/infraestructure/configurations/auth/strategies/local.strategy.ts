import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { IAuth } from '../../../../application/interfaces';
import { AuthUser } from '../../../../application/use-cases';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authUser: AuthUser) {
    super();
  }

  async validate(username: string, password: string): Promise<IAuth> {
    try {
      const user: IAuth = await this.authUser.exec({ username, password });

      if (!user) throw new UnauthorizedException();

      return user;
    } catch (error) {
      this.logger.error(error?.message);

      throw error;
    }
  }
}
