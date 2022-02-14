import { RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import { readFileSync } from 'fs';
import { AppModule } from './app/app.module';
import { getLogLevels } from './LogLevels';

async function bootstrap(): Promise<void> {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
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

  await app.init();

  const httpsOptions = {
    key: readFileSync('./secrets/private-key.key', 'utf8'),
    cert: readFileSync('./secrets/public-certificate.crt', 'utf8'),
  };

  http.createServer(server).listen(process.env.HTTP_PORT || 3000);
  https
    .createServer(httpsOptions, server)
    .listen(process.env.HTTPS_PORT || 443);
}

bootstrap();
