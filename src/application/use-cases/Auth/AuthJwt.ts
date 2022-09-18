import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger } from '@nestjs/common';
import { IAuthJwt, IUser } from '../../interfaces';

@Injectable()
export class AuthJwt {
  private readonly logger = new Logger(AuthJwt.name);

  constructor(private jwtService: JwtService) {}

  async exec(data: IUser): Promise<IAuthJwt> {
    const { username, _id } = data;

    const payload = { username, sub: _id };

    return { token: this.jwtService.sign(payload) };
  }
}
