import { Horaires, HorairesSchema } from './Horaires.schema';
import { Prix, PrixSchema } from './Prix.schema';
import { Rupture, RuptureSchema } from './Rupture.schema';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PointDeVenteDocument = PointDeVente & Document;

@Schema()
export class PointDeVente {
  @Prop()
  id: string;

  @Prop()
  latitude: string;

  @Prop()
  longitude: string;

  @Prop()
  cp: string;

  @Prop({
    enum: ['A', 'R', 'N'],
  })
  pop: 'A' | 'R' | 'N';

  @Prop()
  adresse: string;

  @Prop()
  ville: string;

  @Prop({
    type: HorairesSchema,
    required: false,
  })
  horaires?: Horaires;

  @Prop({
    type: [String],
  })
  services: Array<string>;

  @Prop({
    type: [PrixSchema],
  })
  prix: Array<Prix>;

  @Prop({
    type: [RuptureSchema],
    required: false,
  })
  rupture?: Array<Rupture>;
}

export const PointDeVenteSchema = SchemaFactory.createForClass(PointDeVente);
