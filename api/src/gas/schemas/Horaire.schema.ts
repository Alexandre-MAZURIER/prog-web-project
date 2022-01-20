import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type HoraireDocument = Horaire & Document;

@Schema()
export class Horaire {
  @ApiProperty()
  @Prop()
  ouverture: string;

  @ApiProperty()
  @Prop()
  fermeture: string;
}

export const HoraireSchema = SchemaFactory.createForClass(Horaire);
