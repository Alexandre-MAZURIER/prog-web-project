import { RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { getLogLevels } from './LogLevels';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
  });
  app.setGlobalPrefix('v1', {
    exclude: [{ path: 'status', method: RequestMethod.GET }],
  });
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
