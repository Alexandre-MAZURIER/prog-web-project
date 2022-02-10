import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Horaire, HoraireSchema } from './Horaire.schema';
import { Document } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type JourDocument = Jour & Document;

@Schema({ _id: false })
export class Jour {
  @ApiPropertyOptional({
    type: [Horaire],
    description: 'The schedules the gas station.',
  })
  @Prop({
    type: [HoraireSchema],
    default: [],
    required: false,
  })
  horaire?: Array<Horaire>;

  @ApiProperty({
    enum: [1, 2, 3, 4, 5, 6, 7],
    description: 'The id of the day.',
  })
  @Prop({
    enum: [1, 2, 3, 4, 5, 6, 7],
  })
  id: 1 | 2 | 3 | 4 | 5 | 6 | 7;

  @ApiProperty({
    enum: [
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
      'Dimanche',
    ],
    description: 'The name of the day.',
  })
  @Prop({
    enum: [
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
      'Dimanche',
    ],
  })
  nom:
    | 'Lundi'
    | 'Mardi'
    | 'Mercredi'
    | 'Jeudi'
    | 'Vendredi'
    | 'Samedi'
    | 'Dimanche';

  @ApiProperty({
    type: Boolean,
    description: 'True if the station is closed for the day.',
  })
  @Prop({
    type: Boolean,
  })
  ferme: boolean;
}

export const JourSchema = SchemaFactory.createForClass(Jour);
