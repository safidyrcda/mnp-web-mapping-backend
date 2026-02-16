import { NestFactory } from '@nestjs/core';
import { SeedService } from './seeds.service';
import { AppModule } from 'src/app.module';
import { SeedModule } from './seeds.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);

  const seedService = app.get(SeedService);
  await seedService.run();

  await app.close();
}
bootstrap();
