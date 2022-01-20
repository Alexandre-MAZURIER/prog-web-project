import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Jour, JourSchema } from './Jour.schema';
import { Document } from 'mongoose';

export type HorairesDocument = Horaires & Document;

@Schema()
export class Horaires {
  @Prop({
    type: [JourSchema],
  })
  jour: Array<Jour>;

  @Prop()
  'automate-24-24': '' | '1';
  // nonStop: boolean; // true if 'automate-24-24' is '1'
}

export const HorairesSchema = SchemaFactory.createForClass(Horaires);
