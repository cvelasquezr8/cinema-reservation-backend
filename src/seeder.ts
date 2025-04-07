import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SeedService } from './seed/seed.service';
import { SeedModule } from './seed/seed.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeedModule);
  const logger = new Logger('Seeder');

  const seedService = appContext.get(SeedService);
  await seedService.run();

  await appContext.close();
  logger.log('🎉 Seeding completed!');
}
bootstrap();
