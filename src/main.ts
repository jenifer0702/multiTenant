import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Apply global validation pipe AFTER app is created
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes fields not in DTO
      forbidNonWhitelisted: true, // throws error if extra fields are sent
      transform: true, // automatically transforms payloads to DTO types
    }),
  );

  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
