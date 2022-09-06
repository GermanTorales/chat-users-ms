import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserNotFoundException } from '../../application/exceptions';
import { UpdateUserDTO, GetAllUsersDTO } from '../../application/dtos';
import { GetUser, GetAllUsers, DeleteUser, UpdateUser } from '../../application/use-cases';
import { JwtAuthGuard } from '../configurations';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private getAllUsers: GetAllUsers, private getUser: GetUser, private deleteUser: DeleteUser, private updateUser: UpdateUser) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Get()
  async all(@Query() query: GetAllUsersDTO) {
    return this.getAllUsers.exec(query);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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
