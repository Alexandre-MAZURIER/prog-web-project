import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type HoraireDocument = Horaire & Document;

@Schema()
export class Horaire {
  @ApiProperty({
    type: String,
    description: 'The opening hour of the gas station.',
  })
  @Prop()
  ouverture: string;

  @ApiProperty({
    type: String,
    description: 'The closing hour of the gas station.',
  })
  @Prop()
  fermeture: string;
}

export const HoraireSchema = SchemaFactory.createForClass(Horaire);
