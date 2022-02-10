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
    type: Boolean,
    description: 'True if the gas station is open 24/7.',
  })
  @Prop({
    type: Boolean,
  })
  nonStop: boolean;
}

export const HorairesSchema = SchemaFactory.createForClass(Horaires);
