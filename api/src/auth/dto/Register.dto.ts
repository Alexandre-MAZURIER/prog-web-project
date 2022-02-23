import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    type: String,
    description: 'Username of the user.',
  })
  readonly username: string;

  @ApiProperty({
    type: String,
    description: 'Password of the user.',
  })
  readonly password: string;
}
