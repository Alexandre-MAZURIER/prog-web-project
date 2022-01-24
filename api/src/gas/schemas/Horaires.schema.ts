import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Jour, JourSchema } from './Jour.schema';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type HorairesDocument = Horaires & Document;

@Schema({ _id: false })
export class Horaires {
  @ApiProperty({
    type: [Jour],
    description: 'The opening days of the gas station.',
  })
  @Prop({
    type: [JourSchema],
  })
  jour: Array<Jour>;

  @ApiProperty({
    enum: ['', '1'],
    description: 'Cashless payment if 1.',
  })
  @Prop({
    enum: ['', '1'],
  })
  'automate-24-24': '' | '1';
  // nonStop: boolean; // true if 'automate-24-24' is '1'
}

export const HorairesSchema = SchemaFactory.createForClass(Horaires);
