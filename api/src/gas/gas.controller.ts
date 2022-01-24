import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiNoContentResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LocationDto } from './dto/LocationDto';
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
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The id of the gas station.',
    example: '15004002',
  })
  getPointDeVenteById(@Param('id') id: string): Promise<PointDeVente> {
    return this.gasService.getPointDeVenteById(id);
  }

  @Post('point-de-vente/location')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: PointDeVente,
    isArray: true,
    description:
      'Retrieve all gas station informations near the given position and distance.',
  })
  @ApiBody({
    type: LocationDto,
    description: 'The position of the point to search and the distance.',
  })
  getPointDeVentesByLocation(
    @Body() location: LocationDto,
  ): Promise<Array<PointDeVente>> {
    return this.gasService.getPointDeVentesByLocation(location);
  }
}
