import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Put } from '@nestjs/common';
import { UpdateUserDTO } from '../../application/dtos';
import { CreateUser, GetUser, GetAllUsers, DeleteUser, UpdateUser } from '../../application/use-cases';
import { UserAlreadyExistException } from '../../domain/exceptions';
import { CreateUserDTO } from '../../application/dtos/createUser.dto';
import { UserNotFoundException } from '../../domain/exceptions/UserNotFoundException';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private getAllUsers: GetAllUsers,
    private createUser: CreateUser,
    private getUser: GetUser,
    private deleteUser: DeleteUser,
    private updateUser: UpdateUser
  ) {}

  @Get('/:id')
  async one(@Param('id') id: string) {
    try {
      const user = await this.getUser.exec(id);

      return user;
    } catch (error) {
      this.logger.error(error?.message);

      if (error instanceof UserNotFoundException) throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);

      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async all() {
    return this.getAllUsers.exec();
  }

  @Post()
  async create(@Body() data: CreateUserDTO) {
    try {
      const userCreated = await this.createUser.exec(data);

      return userCreated;
    } catch (error) {
      this.logger.error(error?.message);

      if (error instanceof UserAlreadyExistException) throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);

      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateUserDTO) {
    try {
      const user = await this.updateUser.exec(id, data);

      return user;
    } catch (error) {
      this.logger.error(error?.message);

      if (error instanceof UserNotFoundException) throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);

      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.deleteUser.exec(id);
  }
}
