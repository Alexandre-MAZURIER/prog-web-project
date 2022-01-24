import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GasModule } from 'src/gas/gas.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Horaire, HoraireSchema } from 'src/gas/schemas/Horaire.schema';
import { Horaires, HorairesSchema } from 'src/gas/schemas/Horaires.schema';
import { Jour, JourSchema } from 'src/gas/schemas/Jour.schema';
import {
  PointDeVente,
  PointDeVenteSchema,
} from 'src/gas/schemas/PointDeVente.schema';
import { Prix, PrixSchema } from 'src/gas/schemas/Prix.schema';
import { Rupture, RuptureSchema } from 'src/gas/schemas/Rupture.schema';
import { HttpModule } from '@nestjs/axios';

describe('GasController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GasModule,
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
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/v1/populate-database (GET)', () => {
    return request(app.getHttpServer())
      .get('/v1/populate-database')
      .expect(204)
      .expect('');
  });
});
