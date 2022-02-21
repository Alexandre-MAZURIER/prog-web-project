import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    type: String,
    description: 'Username of the user.',
  })
  username: string;

  @ApiProperty({
    type: String,
    description: 'Password of the user.',
  })
  password: string;
}
