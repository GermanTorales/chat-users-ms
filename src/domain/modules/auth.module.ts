import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserSchema } from '../entities';
import { Entities, Port } from '../enums';
import { AuthJwt, AuthUser } from '../../application/use-cases';
import { OrmModule } from '../../infraestructure/database/orm';
import { AuthController } from '../../infraestructure/controllers';
import { UserRepository } from '../../infraestructure/repositories/UserRepository';
import { configuration, EnvObjects, JwtOptions, JwtStrategy, LocalStrategy } from '../../infraestructure/configurations';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    OrmModule.forFeature([{ name: Entities.User, schema: UserSchema }]),
    PassportModule,
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
    AuthUser,
    LocalStrategy,
    AuthJwt,
    JwtStrategy,
    {
      provide: Port.User,
      useClass: UserRepository,
    },
  ],
  exports: [],
})
export class AuthModule {}
