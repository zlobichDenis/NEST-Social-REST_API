import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { config } from 'aws-sdk';

import { getAwsS3Config } from './config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(
      app.get(Reflector),
  ));
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  config.update(getAwsS3Config(configService));

  await app.listen(5000);

  console.log(`Server start on 5000 port`);
}
bootstrap();
