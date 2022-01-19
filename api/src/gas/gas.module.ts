import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GasController } from './gas.controller';
import { GasService } from './gas.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [GasController],
  providers: [GasService],
})
export class GasModule {}
