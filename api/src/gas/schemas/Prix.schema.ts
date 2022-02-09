import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type PrixDocument = Prix & Document;

@Schema({ _id: false })
export class Prix {
  @ApiProperty({
    enum: ['Gazole', 'SP95', 'E85', 'GPLc', 'E10', 'SP98'],
    description: 'The name of the gas.',
  })
  @Prop({
    enum: ['Gazole', 'SP95', 'E85', 'GPLc', 'E10', 'SP98'],
  })
  nom: 'Gazole' | 'SP95' | 'E85' | 'GPLc' | 'E10' | 'SP98';

  @ApiProperty({
    enum: [1, 2, 3, 4, 5, 6],
    description: 'The id of the gas.',
  })
  @Prop({
    enum: [1, 2, 3, 4, 5, 6],
  })
  id: 1 | 2 | 3 | 4 | 5 | 6;

  @ApiProperty({
    type: Date,
    description: 'The date of the last update of the price.',
  })
  @Prop({
    type: Date,
  })
  maj: Date;

  @ApiProperty({
    type: Number,
    description: 'The price of the gas.',
  })
  @Prop()
  valeur: number;
}

export const PrixSchema = SchemaFactory.createForClass(Prix);
