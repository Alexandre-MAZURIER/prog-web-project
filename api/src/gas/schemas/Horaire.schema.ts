import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type HoraireDocument = Horaire & Document;

@Schema({ _id: false })
export class Horaire {
  @ApiProperty({
    type: String,
    description: 'The opening hour of the gas station.',
  })
  @Prop({
    type: String,
  })
  ouverture: string;

  @ApiProperty({
    type: String,
    description: 'The closing hour of the gas station.',
  })
  @Prop({
    type: String,
  })
  fermeture: string;
}

export const HoraireSchema = SchemaFactory.createForClass(Horaire);
