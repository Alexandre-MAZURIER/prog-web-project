import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Jour, JourSchema } from './Jour.schema';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type HorairesDocument = Horaires & Document;

@Schema()
export class Horaires {
  @ApiProperty({ type: [Jour] })
  @Prop({
    type: [JourSchema],
  })
  jour: Array<Jour>;

  @ApiProperty({ enum: ['', '1'] })
  @Prop({ enum: ['', '1'] })
  'automate-24-24': '' | '1';
  // nonStop: boolean; // true if 'automate-24-24' is '1'
}

export const HorairesSchema = SchemaFactory.createForClass(Horaires);
