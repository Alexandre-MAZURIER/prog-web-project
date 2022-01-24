import { ApiProperty } from '@nestjs/swagger';

export class GeoLocationDto {
  @ApiProperty({
    type: Number,
    description: 'The latitude of the location.',
  })
  readonly latitude: number;

  @ApiProperty({
    type: Number,
    description: 'The longitude of the location.',
  })
  readonly longitude: number;
}
