import { Horaires, HorairesSchema } from './Horaires.schema';
import { Prix, PrixSchema } from './Prix.schema';
import { Rupture, RuptureSchema } from './Rupture.schema';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Position, PositionSchema } from './Position.schema';

export type PointDeVenteDocument = PointDeVente & Document;

@Schema(/* { versionKey: false } */)
export class PointDeVente {
  @ApiProperty({
    type: Number,
    description: 'The id of the gas station in XML file.',
  })
  @Prop({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: Position,
    description: 'The position of the gas station.',
  })
  @Prop({
    type: PositionSchema,
    index: '2dsphere',
  })
  position: Position;

  @ApiProperty({
    type: Number,
    description: 'The postal code of the gas station.',
  })
  @Prop({
    type: Number,
  })
  cp: number;

  @ApiProperty({
    enum: ['A', 'R', 'N'],
    description:
      'The area of the gas station. (A = autoroute, R = route, N = non-route)',
  })
  @Prop({
    enum: ['A', 'R', 'N'],
  })
  pop: 'A' | 'R' | 'N';

  @ApiProperty({
    type: String,
    description: 'The address of the gas station.',
  })
  @Prop({
    type: String,
  })
  adresse: string;

  @ApiProperty({
    type: String,
    description: 'The city of the gas station.',
  })
  @Prop({
    type: String,
  })
  ville: string;

  @ApiPropertyOptional({
    type: Horaires,
    description: 'The opening hours of the gas station.',
  })
  @Prop({
    type: HorairesSchema,
    default: [],
    required: false,
  })
  horaires?: Horaires;

  @ApiPropertyOptional({
    type: [String],
    description: 'The services of the gas station.',
  })
  @Prop({
    type: [String],
    default: [],
    required: false,
  })
  services?: Array<string>;

  @ApiPropertyOptional({
    type: [Prix],
    description: 'The prices of the gas station.',
  })
  @Prop({
    type: [PrixSchema],
    default: [],
    required: false,
  })
  prix?: Array<Prix>;

  @ApiPropertyOptional({
    type: [Rupture],
    description: 'The ruptures of the gas station.',
  })
  @Prop({
    type: [RuptureSchema],
    default: [],
    required: false,
  })
  rupture?: Array<Rupture>;
}

export const PointDeVenteSchema = SchemaFactory.createForClass(PointDeVente);
PointDeVenteSchema.index({ position: '2dsphere' });
