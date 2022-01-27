import { ApiProperty } from '@nestjs/swagger';
import { GeoLocationDto } from './GeoLocationDto';

export class LocationDto {
  @ApiProperty({
    type: GeoLocationDto,
    description: 'The location of the user.',
  })
  readonly position: GeoLocationDto;

  @ApiProperty({
    minimum: 500,
    maximum: 50000,
    type: Number,
    description: 'The distance in meters from the user to the gas station.',
    example: 10000,
  })
  readonly distance: number;
}
