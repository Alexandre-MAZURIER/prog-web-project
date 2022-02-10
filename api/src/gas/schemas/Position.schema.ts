import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PositionDocument = Position & Document;

@Schema({ _id: false })
export class Position {
  @ApiProperty({
    type: Number,
    description: 'The latitude of the gas station.',
    minimum: -90,
    maximum: 90,
  })
  @Prop({
    type: Number,
    min: -90,
    max: 90,
  })
  latitude: number;

  @ApiProperty({
    type: Number,
    description: 'The longitude of the gas station.',
    minimum: -180,
    maximum: 180,
  })
  @Prop({
    type: Number,
    min: -180,
    max: 180,
  })
  longitude: number;
}

export const PositionSchema = SchemaFactory.createForClass(Position);
