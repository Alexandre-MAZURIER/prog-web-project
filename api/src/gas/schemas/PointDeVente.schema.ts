import { Horaires, HorairesSchema } from './Horaires.schema';
import { Prix, PrixSchema } from './Prix.schema';
import { Rupture, RuptureSchema } from './Rupture.schema';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type PointDeVenteDocument = PointDeVente & Document;

@Schema()
export class PointDeVente {
  @ApiProperty()
  @Prop()
  id: string;

  @ApiProperty()
  @Prop()
  latitude: string;

  @ApiProperty()
  @Prop()
  longitude: string;

  @ApiProperty()
  @Prop()
  cp: string;

  @ApiProperty({
    enum: ['A', 'R', 'N'],
  })
  @Prop({
    enum: ['A', 'R', 'N'],
  })
  pop: 'A' | 'R' | 'N';

  @ApiProperty()
  @Prop()
  adresse: string;

  @ApiProperty()
  @Prop()
  ville: string;

  @ApiPropertyOptional()
  @Prop({
    type: HorairesSchema,
    required: false,
  })
  horaires?: Horaires;

  @ApiProperty({ type: [String] })
  @Prop({
    type: [String],
  })
  services: Array<string>;

  @ApiPropertyOptional({ type: [Prix] })
  @Prop({
    type: [PrixSchema],
    required: false,
  })
  prix: Array<Prix>;

  @ApiPropertyOptional({ type: [Rupture] })
  @Prop({
    type: [RuptureSchema],
    required: false,
  })
  rupture?: Array<Rupture>;
}

export const PointDeVenteSchema = SchemaFactory.createForClass(PointDeVente);
