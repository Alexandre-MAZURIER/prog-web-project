import { ApiPropertyOptional } from '@nestjs/swagger';

export class PointDeVenteFilterDto {
  @ApiPropertyOptional({
    enum: ['A', 'R', 'N'],
    description:
      'The area of the gas station. (A = autoroute, R = route, N = non-route).',
  })
  readonly pop?: 'A' | 'R' | 'N';

  @ApiPropertyOptional({
    type: String,
    description: 'The city of the gas station.',
  })
  readonly ville?: string;

  @ApiPropertyOptional({
    enum: ['Gazole', 'SP95', 'E85', 'GPLc', 'E10', 'SP98'],
    description: 'The type of gas to retrieve',
  })
  readonly typeEssence?: 'Gazole' | 'SP95' | 'E85' | 'GPLc' | 'E10' | 'SP98';

  @ApiPropertyOptional({
    type: Number,
    description: 'The max price of the gas.',
  })
  readonly prixMax?: number;
}
