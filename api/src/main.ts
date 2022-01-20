import { RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { getLogLevels } from './LogLevels';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
  });

  const globalPrefix = 'v1';

  app.setGlobalPrefix(globalPrefix, {
    exclude: [{ path: 'status', method: RequestMethod.GET }],
  });
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API for Programmable Web Application')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(globalPrefix + '/api-docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
