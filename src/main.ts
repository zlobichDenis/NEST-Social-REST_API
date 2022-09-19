import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = await app.listen(5000);

  console.log(`Server start on ${port}`);
}
bootstrap();
