import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './infraestructure/modules';
import { morganSuccessHandler, morganErrorHandler } from './infraestructure/configurations';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: true, methods: ['GET', 'POST', 'PUT', 'DELETE'] } });

  app.use(morganSuccessHandler);
  app.use(morganErrorHandler);

  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const NODE_PORT = configService.get('NODE_PORT');

  await app.listen(NODE_PORT, () => Logger.log(`Server listening on port: ${NODE_PORT}`, 'App'));
}
bootstrap();
