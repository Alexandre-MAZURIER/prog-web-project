import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Horaire, HoraireSchema } from './Horaire.schema';
import { Document } from 'mongoose';

export type JourDocument = Jour & Document;

@Schema()
export class Jour {
  @Prop({
    type: [HoraireSchema],
  })
  horaire: Array<Horaire>;

  @Prop()
  id: string;

  @Prop()
  nom: string;

  @Prop()
  ferme: string;
}

export const JourSchema = SchemaFactory.createForClass(Jour);
