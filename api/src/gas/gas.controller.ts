import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiNoContentResponse,
  ApiParam,
  ApiQuery,
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
  @ApiQuery({
    type: String,
    name: 'query',
    required: false,
    example: 'ville=Nice',
    description:
      'Query to filter results. See <https://github.com/loris/api-query-params> for more informations.',
  })
  @ApiResponse({
    status: 200,
    type: PointDeVente,
    isArray: true,
    description:
      'Retrieve all gas station informations according to the given criteria. If no query is provided, all gas stations are returned.',
  })
  async getPointsDeVente(
    @Query('query') query?: string,
  ): Promise<Array<PointDeVente>> {
    if (query?.length > 0) {
      return await this.gasService.findPointsDeVente(query);
    } else {
      return await this.gasService.getAllPointDeVente();
    }
  }

  @Get('point-de-vente/near')
  @ApiResponse({
    status: 200,
    type: PointDeVente,
    isArray: true,
    description:
      'Retrieve all gas station informations near the given position and distance.',
  })
  async getPointsDeVenteByLocationUsingQueryParams(
    @Query() location: LocationDto,
  ): Promise<Array<PointDeVente>> {
    console.log(location);
    return await this.gasService.getPointsDeVenteByLocationUsingQueryParams(
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
  async getPointsDeVenteByLocation(
    @Body() location: LocationDto,
  ): Promise<Array<PointDeVente>> {
    return await this.gasService.getPointsDeVenteByLocation(location);
  }

  @Get('point-de-vente/:id')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The id of the gas station.',
    example: '15004002',
  })
  @ApiResponse({
    status: 200,
    type: PointDeVente,
    description:
      'Retrieve gas station informations according to the id specified as parameter.',
  })
  async getPointDeVenteById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<PointDeVente> {
    return await this.gasService.getPointDeVenteById(id);
  }
}
