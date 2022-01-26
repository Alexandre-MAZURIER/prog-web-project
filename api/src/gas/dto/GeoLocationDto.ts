import { ApiProperty } from '@nestjs/swagger';

export class GeoLocationDto {
  @ApiProperty({
    type: Number,
    description: 'The latitude of the location.',
    minimum: -90,
    maximum: 90,
    example: 43.6961,
  })
  readonly latitude: number;

  @ApiProperty({
    type: Number,
    description: 'The longitude of the location.',
    minimum: -180,
    maximum: 180,
    example: 7.27178,
  })
  readonly longitude: number;
}
