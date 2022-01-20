import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type PrixDocument = Prix & Document;

@Schema()
export class Prix {
  @ApiProperty()
  @Prop()
  nom: string;

  @ApiProperty()
  @Prop()
  id: string;

  @ApiProperty()
  @Prop({
    type: Date,
  })
  maj: Date;

  @ApiProperty()
  @Prop()
  valeur: string;
}

export const PrixSchema = SchemaFactory.createForClass(Prix);
