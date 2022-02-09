import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type RuptureDocument = Rupture & Document;

@Schema({ _id: false })
export class Rupture {
  @ApiProperty({
    enum: [1, 2, 3, 4, 5, 6],
    description: 'The id of the rupture.',
  })
  @Prop({
    enum: [1, 2, 3, 4, 5, 6],
  })
  id: 1 | 2 | 3 | 4 | 5 | 6;

  @ApiProperty({
    enum: ['Gazole', 'SP95', 'E85', 'GPLc', 'E10', 'SP98'],
    description: 'The name of the gas which is in rupture.',
  })
  @Prop({
    enum: ['Gazole', 'SP95', 'E85', 'GPLc', 'E10', 'SP98'],
  })
  nom: 'Gazole' | 'SP95' | 'E85' | 'GPLc' | 'E10' | 'SP98';

  @ApiProperty({
    type: Date,
    description: 'The begin of the rupture.',
  })
  @Prop({
    type: Date,
  })
  debut: Date;

  @ApiPropertyOptional({
    type: Date,
    description: 'The end of the rupture.',
  })
  @Prop({
    type: Date,
    required: false,
  })
  fin?: Date;
}

export const RuptureSchema = SchemaFactory.createForClass(Rupture);
