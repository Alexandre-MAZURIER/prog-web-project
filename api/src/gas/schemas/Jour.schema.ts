import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Horaire, HoraireSchema } from './Horaire.schema';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type JourDocument = Jour & Document;

@Schema({ _id: false })
export class Jour {
  @ApiProperty({
    type: [Horaire],
    description: 'The schedules the gas station.',
  })
  @Prop({
    type: [HoraireSchema],
  })
  horaire: Array<Horaire>;

  @ApiProperty({
    type: String,
    description: 'The id of the day.',
  })
  @Prop()
  id: string;

  @ApiProperty({
    type: String,
    description: 'The name of the day.',
  })
  @Prop()
  nom: string;

  @ApiProperty({
    enum: ['', '1'],
    description: 'Closed station for the day if 1.',
  })
  @Prop({
    enum: ['', '1'],
  })
  ferme: '' | '1';
}

export const JourSchema = SchemaFactory.createForClass(Jour);
