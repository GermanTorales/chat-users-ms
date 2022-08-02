import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { UpdateUserDTO } from 'src/application/dtos';
import { CreateUser, GetUser, GetAllUsers, DeleteUser, UpdateUser } from 'src/application/use-cases';
import { UserAlreadyExistException } from 'src/domain/exceptions';
import { CreateUserDTO } from '../../application/dtos/createUser.dto';

@Controller('users')
export class UserController {
  constructor(
    private getAllUsers: GetAllUsers,
    private createUser: CreateUser,
    private getUser: GetUser,
    private deleteUser: DeleteUser,
    private updateUser: UpdateUser
  ) {}

  @Get()
  async all() {
    return this.getAllUsers.exec();
  }

  @Get('/:id')
  async one(@Param('id') id: string) {
    return this.getUser.exec(id);
  }

  @Post()
  async create(@Body() data: CreateUserDTO) {
    try {
      const userCreated = await this.createUser.exec(data);

      return userCreated;
    } catch (error) {
      if (error instanceof UserAlreadyExistException) throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);

      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateUserDTO) {
    return this.updateUser.exec(id, data);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.deleteUser.exec(id);
  }
}
