import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Put } from '@nestjs/common';
import { UpdateUserDTO, CreateUserDTO } from '../../application/dtos';
import { CreateUser, GetUser, GetAllUsers, DeleteUser, UpdateUser } from '../../application/use-cases';
import { UserNotFoundException, UserInvalidDataException, UserAlreadyExistException } from '../../domain/exceptions';

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

      return { message: `User with ID ${id} found`, data: user };
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

      return { message: 'New user created', data: userCreated };
    } catch (error) {
      this.logger.error(error?.message);

      if (error instanceof UserAlreadyExistException) throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
      if (error instanceof UserInvalidDataException) throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);

      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateUserDTO) {
    try {
      const user = await this.updateUser.exec(id, data);

      return { message: `User with ID ${id} has been updated`, data: user };
    } catch (error) {
      this.logger.error(error?.message);

      if (error instanceof UserNotFoundException) throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);

      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    try {
      const userDeleted = await this.deleteUser.exec(id);

      return { message: `User with ID ${id} deleted`, data: userDeleted };
    } catch (error) {
      this.logger.error(error?.message);

      if (error instanceof UserNotFoundException) throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);

      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
