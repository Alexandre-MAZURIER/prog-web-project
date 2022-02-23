import { User } from '../../user/schemas/User.schema';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class Payload {
  @ApiProperty({
    type: OmitType(User, ['password']),
    description: 'User.',
  })
  readonly user: Omit<User, 'password'>;

  @ApiProperty({
    type: String,
    description: 'Token to validate requests.',
  })
  readonly token: string;
}
