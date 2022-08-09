import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { OrmModule } from '../../infraestructure/database/orm';
import { UserSchema } from '../entities';
import { Entities } from '../enums/entities.enum';
import { UserController } from 'src/infraestructure/controllers/user.controller';
import { UserRepository } from 'src/infraestructure/repositories/UserRepository';
import { GetAllUsers, CreateUser, GetUser, DeleteUser, UpdateUser } from '../../application/use-cases';
import { Port } from '../enums/ports';
import { JwtAuthGuard } from '../../infraestructure/configurations';

@Module({
  imports: [OrmModule.forFeature([{ name: Entities.User, schema: UserSchema }])],
  controllers: [UserController],
  providers: [
    GetAllUsers,
    CreateUser,
    GetUser,
    DeleteUser,
    UpdateUser,
    {
      provide: Port.User,
      useClass: UserRepository,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [],
})
export class UserModule {}
