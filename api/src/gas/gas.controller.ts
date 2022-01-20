import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { ApiNoContentResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GasService } from './gas.service';
import { PointDeVente } from './schemas/PointDeVente.schema';

@ApiTags('Gas Service')
@Controller('gas')
export class GasController {
  constructor(private readonly gasService: GasService) {}

  @Get('populate-database')
  @HttpCode(204)
  @ApiNoContentResponse({
    description:
      'Fetch daily gas station informations and store them in database.',
  })
  populateDatabaseWithDailyData(): Promise<void> {
    return this.gasService.populateDatabaseWithDailyData();
  }

  @Get('point-de-vente')
  @ApiResponse({
    status: 200,
    type: PointDeVente,
    isArray: true,
    description: 'Retrieve all gas station informations stored in database.',
  })
  getAllPointDeVente(): Promise<Array<PointDeVente>> {
    return this.gasService.getAllPointDeVente();
  }

  @Get('point-de-vente/:id')
  @ApiResponse({
    status: 200,
    type: PointDeVente,
    description:
      'Retrieve gas station informations according to the id specified as parameter.',
  })
  getPointDeVenteById(@Param('id') id: string): Promise<PointDeVente> {
    return this.gasService.getPointDeVenteById(id);
  }
}
