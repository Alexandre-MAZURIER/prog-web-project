import { HttpModule } from '@nestjs/axios';
import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { GasController } from './gas.controller';
import { GasService } from './gas.service';
import { Horaire, HoraireSchema } from './schemas/Horaire.schema';
import { Horaires, HorairesSchema } from './schemas/Horaires.schema';
import { Jour, JourSchema } from './schemas/Jour.schema';
import {
  PointDeVente,
  PointDeVenteSchema,
} from './schemas/PointDeVente.schema';
import { Prix, PrixSchema } from './schemas/Prix.schema';
import { Rupture, RuptureSchema } from './schemas/Rupture.schema';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    MongooseModule.forFeature([
      { name: PointDeVente.name, schema: PointDeVenteSchema },
      { name: Horaires.name, schema: HorairesSchema },
      { name: Jour.name, schema: JourSchema },
      { name: Horaire.name, schema: HoraireSchema },
      { name: Prix.name, schema: PrixSchema },
      { name: Rupture.name, schema: RuptureSchema },
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
