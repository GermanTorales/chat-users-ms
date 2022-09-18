import { HttpCode, HttpStatus } from '@nestjs/common';
import { Controller, Logger, Post, UseGuards, Request, Body, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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

      if (error instanceof UserAlreadyExistException) throw new BadRequestException(error?.message);
      if (error instanceof UserInvalidDataException) throw new BadRequestException(error?.message);
      if (error instanceof UserPasswordException) throw new BadRequestException(error?.message);

      throw new InternalServerErrorException('Server error');
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    const { token } = await this.authJwt.exec(req.user);

    return { message: 'Successful login', data: { token } };
  }
}
