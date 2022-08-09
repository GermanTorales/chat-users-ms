import { Controller, Logger, Post, UseGuards, Request } from '@nestjs/common';
import { AuthJwt } from 'src/application/use-cases';
import { LocalAuthGuard } from '../configurations';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authJwt: AuthJwt) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Request() req) {
    return this.authJwt.exec(req.user);
  }
}
