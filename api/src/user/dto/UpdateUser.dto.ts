import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    description: 'Username of the user.',
  })
  readonly username: string;

  @ApiProperty({
    type: String,
    description: 'Old password of the user.',
  })
  readonly oldPassword: string;

  @ApiProperty({
    type: String,
    description: 'New password of the user.',
  })
  readonly newPassword: string;
}
