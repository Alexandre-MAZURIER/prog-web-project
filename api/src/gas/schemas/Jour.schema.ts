import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Horaire, HoraireSchema } from './Horaire.schema';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type JourDocument = Jour & Document;

@Schema()
export class Jour {
  @ApiProperty({ type: [Horaire] })
  @Prop({
    type: [HoraireSchema],
  })
  horaire: Array<Horaire>;

  @ApiProperty()
  @Prop()
  id: string;

  @ApiProperty()
  @Prop()
  nom: string;

  @ApiProperty()
  @Prop()
  ferme: string;
}

export const JourSchema = SchemaFactory.createForClass(Jour);
