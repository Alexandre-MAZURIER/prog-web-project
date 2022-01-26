import { RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { getLogLevels } from './LogLevels';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
  });

  const globalPrefix = 'v1';

  app.setGlobalPrefix(globalPrefix, {
    exclude: [{ path: 'status', method: RequestMethod.GET }],
  });

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API for Programmable Web Project')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(globalPrefix + '/api', app, document);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
