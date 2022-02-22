import { HttpModule } from '@nestjs/axios';
import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { GasController } from './gas.controller';
import { GasService } from './gas.service';
import {
  PointDeVente,
  PointDeVenteSchema,
} from './schemas/PointDeVente.schema';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    MongooseModule.forFeature([
      { name: PointDeVente.name, schema: PointDeVenteSchema },
    ]),
    CacheModule.register({
      ttl: 60 * 60 * 24, // 1 day
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [GasController],
  providers: [
    GasService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class GasModule {}
