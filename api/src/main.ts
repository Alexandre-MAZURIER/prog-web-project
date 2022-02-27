import { RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import express from 'express';
import http from 'http';
import https from 'https';
import { existsSync, readFileSync } from 'fs';
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
    .setVersion('1.0.1')
    .setDescription('API for Programmable Web Project')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  const swaggerptions: SwaggerCustomOptions = {
    customSiteTitle: 'API Docs for Programmable Web Project',
  };
  SwaggerModule.setup(globalPrefix + '/api', app, document, swaggerptions);

  await app.init();

  http
    .createServer(server)
    .listen(process.env.HTTP_PORT || process.env.PORT || 3000);

  if (existsSync('secrets')) {
    const httpsOptions = {
      key: readFileSync('./secrets/private-key.key', 'utf8'),
      cert: readFileSync('./secrets/public-certificate.crt', 'utf8'),
    };
    https
      .createServer(httpsOptions, server)
      .listen(process.env.HTTPS_PORT || 443);
  }
}

bootstrap();
