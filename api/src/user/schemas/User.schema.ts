import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @ApiProperty({
    type: String,
    description: 'Username of the user.',
  })
  @Prop({
    type: String,
  })
  username: string;

  @ApiProperty({
    type: String,
    description: 'Password of the user.',
  })
  @Prop({
    type: String,
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
