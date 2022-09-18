import { Module } from '@nestjs/common';
import { OrmModule } from '../database/orm';
import { User, UserSchema } from '../../domain/entities';
import { UserController } from '../controllers/user.controller';
import { UserRepository } from '../repositories/UserRepository';
import { GetAllUsers, CreateUser, GetUser, DeleteUser, UpdateUser } from '../../application/use-cases';
import { Port } from '../../application/enums';

@Module({
  imports: [OrmModule.forFeature([{ name: User.name, schema: UserSchema }])],
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
