import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PrixDocument = Prix & Document;

@Schema()
export class Prix {
  @Prop()
  nom: string;

  @Prop()
  id: string;

  @Prop({
    type: Date,
  })
  maj: Date;

  @Prop()
  valeur: string;
}

export const PrixSchema = SchemaFactory.createForClass(Prix);
