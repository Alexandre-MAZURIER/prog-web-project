import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiResponse,
  ApiTags,
  PartialType,
} from '@nestjs/swagger';
import { User } from './schemas/User.schema';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@ApiTags('User Service')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Put('update')
  @ApiBody({
    type: User,
    description: 'User data to update. The user must be logged in.',
  })
  @ApiResponse({
    status: 200,
    type: PartialType(User),
    description: 'User data updated.',
  })
  async update(@Body() user: User): Promise<Partial<User>> {
    return await this.userService.update(user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  @HttpCode(204)
  @ApiNoContentResponse({
    description: 'Delete a user from the database. The user must be logged in.',
  })
  async delete(@Body() user: User): Promise<void> {
    return await this.userService.delete(user);
  }
}
