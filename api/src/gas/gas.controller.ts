import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
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
  async populateDatabaseWithDailyData(): Promise<void> {
    return await this.gasService.populateDatabaseWithDailyData();
  }

  @Get('point-de-vente')
  @ApiResponse({
    status: 200,
    type: PointDeVente,
    isArray: true,
    description: 'Retrieve all gas station informations stored in database.',
  })
  async getAllPointDeVente(): Promise<Array<PointDeVente>> {
    return await this.gasService.getAllPointDeVente();
  }

  @Get('point-de-vente/near')
  @ApiResponse({
    status: 200,
    type: PointDeVente,
    isArray: true,
    description:
      'Retrieve all gas station informations near the given position and distance.',
  })
  async getPointDeVentesByLocationUsingQueryParams(
    @Query() location: LocationDto,
  ): Promise<Array<PointDeVente>> {
    console.log(location);
    return await this.gasService.getPointDeVentesByLocationUsingQueryParams(
      location,
    );
  }

  @Post('point-de-vente/near')
  @HttpCode(200)
  @ApiBody({
    type: LocationDto,
    description: 'The position of the point to search and the distance.',
  })
  @ApiResponse({
    status: 200,
    type: PointDeVente,
    isArray: true,
    description:
      'Retrieve all gas station informations near the given position and distance.',
  })
  async getPointDeVentesByLocation(
    @Body() location: LocationDto,
  ): Promise<Array<PointDeVente>> {
    return await this.gasService.getPointDeVentesByLocation(location);
  }

  @Get('point-de-vente/:id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The id of the gas station.',
    example: '15004002',
  })
  @ApiResponse({
    status: 200,
    type: PointDeVente,
    description:
      'Retrieve gas station informations according to the id specified as parameter.',
  })
  async getPointDeVenteById(@Param('id') id: string): Promise<PointDeVente> {
    return await this.gasService.getPointDeVenteById(id);
  }
}
