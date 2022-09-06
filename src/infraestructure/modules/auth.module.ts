import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserSchema } from '../../domain/entities';
import { Entities, Port } from '../../application/enums';
import { AuthJwt, AuthUser, CreateUser } from '../../application/use-cases';
import { OrmModule } from '../database/orm';
import { AuthController } from '../controllers';
import { UserRepository } from '../repositories/UserRepository';
import { EnvObjects, JwtOptions, JwtStrategy, LocalStrategy } from '../configurations';

@Module({
  imports: [
    PassportModule,
    OrmModule.forFeature([{ name: Entities.User, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const data = configService.get<JwtOptions>(EnvObjects.JWT_OPTIONS);

        return {
          secret: data.secret,
          signOptions: { expiresIn: data.expiresIn },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    CreateUser,
    AuthUser,
    AuthJwt,
    LocalStrategy,
    JwtStrategy,
    {
      provide: Port.User,
      useClass: UserRepository,
    },
  ],
  exports: [],
})
export class AuthModule {}
