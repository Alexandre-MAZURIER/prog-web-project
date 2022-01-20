import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RuptureDocument = Rupture & Document;

@Schema()
export class Rupture {
  @Prop()
  id: string;

  @Prop()
  nom: string;

  @Prop({
    type: Date,
  })
  debut: Date;

  @Prop({
    type: Date,
    required: false,
  })
  fin?: Date;
}

export const RuptureSchema = SchemaFactory.createForClass(Rupture);
