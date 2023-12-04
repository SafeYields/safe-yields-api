import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    cors: {
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      origin: [
        'https://app.safeyields.io',
        'https://safeyields.io',
        /\.safeyields\.io$/,
      ],
    },
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  await app.listen(port || 7373);
}

bootstrap();
