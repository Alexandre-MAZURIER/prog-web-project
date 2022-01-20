import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type RuptureDocument = Rupture & Document;

@Schema()
export class Rupture {
  @ApiProperty()
  @Prop()
  id: string;

  @ApiProperty()
  @Prop()
  nom: string;

  @ApiProperty()
  @Prop({
    type: Date,
  })
  debut: Date;

  @ApiPropertyOptional()
  @Prop({
    type: Date,
    required: false,
  })
  fin?: Date;
}

export const RuptureSchema = SchemaFactory.createForClass(Rupture);
