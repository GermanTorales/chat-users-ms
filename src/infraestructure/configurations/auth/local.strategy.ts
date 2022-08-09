import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { IAuth } from '../../../domain/interfaces';
import { AuthUser } from '../../../application/use-cases';
import { InvalidCredentialsException } from '../../../domain/exceptions';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authUser: AuthUser) {
    super();
  }

  async validate(username: string, password: string): Promise<IAuth> {
    try {
      const user: IAuth = await this.authUser.exec({ username, password });

      if (!user) throw new InvalidCredentialsException({ message: 'Username or password are incorrect' });

      return user;
    } catch (error) {
      this.logger.error(error?.message);

      if (error instanceof InvalidCredentialsException) throw new HttpException(error?.message, HttpStatus.UNAUTHORIZED);

      throw error;
    }
  }
}
