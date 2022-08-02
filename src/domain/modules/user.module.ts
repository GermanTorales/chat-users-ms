import { Module } from '@nestjs/common';
import { OrmModule } from '../../infraestructure/database/orm';
import { UserSchema } from '../entities';
import { Entities } from '../enums/entities.enum';
import { UserController } from 'src/infraestructure/controllers/user.controller';
import { UserRepository } from 'src/infraestructure/repositories/UserRepository';
import { GetAllUsers, CreateUser, GetUser, DeleteUser, UpdateUser } from '../../application/use-cases';
import { Port } from '../enums/ports';

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
  ],
  exports: [],
})
export class UserModule {}
