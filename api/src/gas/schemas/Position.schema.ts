import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PositionDocument = Position & Document;

@Schema({ _id: false })
export class Position {
  @ApiProperty({
    type: Number,
    description: 'The latitude of the gas station.',
  })
  @Prop()
  latitude: number;

  @ApiProperty({
    type: Number,
    description: 'The latitude of the gas station.',
  })
  @Prop()
  longitude: number;
}

export const PositionSchema = SchemaFactory.createForClass(Position);
