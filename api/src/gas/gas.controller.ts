import { Controller, Get, Param } from '@nestjs/common';
import { GasService } from './gas.service';
import { PointDeVente } from './schemas/PointDeVente.schema';

@Controller('gas')
export class GasController {
  constructor(private readonly gasService: GasService) {}

  @Get('daily-data')
  getDailyData(): Promise<void> {
    return this.gasService.getDailyData();
  }

  @Get('point-de-vente')
  getAllPointDeVente(): Promise<Array<PointDeVente>> {
    return this.gasService.getAllPointDeVente();
  }

  @Get('point-de-vente/:id')
  getPointDeVenteById(@Param('id') id: string): Promise<PointDeVente> {
    return this.gasService.getDataPointDeVente(id);
  }
}
