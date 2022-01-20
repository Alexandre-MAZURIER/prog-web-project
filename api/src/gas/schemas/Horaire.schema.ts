import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HoraireDocument = Horaire & Document;

@Schema()
export class Horaire {
  @Prop()
  ouverture: string;

  @Prop()
  fermeture: string;
}

export const HoraireSchema = SchemaFactory.createForClass(Horaire);
