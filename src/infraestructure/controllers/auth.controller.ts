import { Controller, Logger, Post, UseGuards, Request, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UserAlreadyExistException, UserInvalidDataException, UserPasswordException } from '../../application/exceptions';
import { CreateUserDTO } from '../../application/dtos';
import { AuthJwt, CreateUser } from '../../application/use-cases';
import { LocalAuthGuard } from '../configurations';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authJwt: AuthJwt, private readonly createUser: CreateUser) {}

  @Post('register')
  async create(@Body() data: CreateUserDTO) {
    try {
      const userCreated = await this.createUser.exec(data);

      return { message: 'New user created', data: userCreated };
    } catch (error) {
      this.logger.error(error?.message);

      if (error instanceof UserAlreadyExistException) throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
      if (error instanceof UserInvalidDataException) throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
      if (error instanceof UserPasswordException) throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);

      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authJwt.exec(req.user);
  }
}
