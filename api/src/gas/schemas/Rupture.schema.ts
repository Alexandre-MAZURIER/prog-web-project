import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type RuptureDocument = Rupture & Document;

@Schema({ _id: false })
export class Rupture {
  @ApiProperty({
    type: String,
    description: 'The id of the rupture.',
  })
  @Prop()
  id: string;

  @ApiProperty({
    type: String,
    description: 'The name of the rupture.',
  })
  @Prop()
  nom: string;

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
