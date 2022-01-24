import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type PrixDocument = Prix & Document;

@Schema()
export class Prix {
  @ApiProperty({
    type: String,
    description: 'The name of the gas.',
  })
  @Prop()
  nom: string;

  @ApiProperty({
    type: String,
    description: 'The id of the gas.',
  })
  @Prop()
  id: string;

  @ApiProperty({
    type: Date,
    description: 'The date of the last update of the price.',
  })
  @Prop({
    type: Date,
  })
  maj: Date;

  @ApiProperty({
    type: String,
    description: 'The price of the gas.',
  })
  @Prop()
  valeur: string;
}

export const PrixSchema = SchemaFactory.createForClass(Prix);
