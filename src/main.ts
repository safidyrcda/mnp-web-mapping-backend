import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log('Environment Variables:', {
    LISTEN_PORT: process.env.LISTEN_PORT,
    DATABASE_USER: process.env.DATABASE_USER ? '***' : 'non défini',
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ? '***' : 'non défini',
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_LISTEN_PORT: process.env.DATABASE_LISTEN_PORT,
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  });

  const config = new DocumentBuilder()
    .setTitle('MNP Funding API')
    .setDescription('API Of the MNP Funding')
    .setVersion('1.0')
    .addTag('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.LISTEN_PORT ?? 4000);
}
bootstrap();
