import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 4000);
  app.enableCors({ origin: 'http://127.0.0.1:3000' });
}
bootstrap();
