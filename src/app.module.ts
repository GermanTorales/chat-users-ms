import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './domain/modules/user.module';
import { configuration, MongoOptions, EnvObjects } from './infraestructure/configurations';
import { OrmModule } from './infraestructure/database/orm';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    OrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const data = configService.get<MongoOptions>(EnvObjects.MONGO_OPTIONS);

        return { uri: data?.host, ...data.options };
      },
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [],
})
export class AppModule {}
