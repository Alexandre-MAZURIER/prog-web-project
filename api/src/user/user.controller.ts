import { UpdateUserDto } from './dto/UpdateUser.dto';
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
  OmitType,
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
    type: UpdateUserDto,
    description: 'User data to update. The user must be logged in.',
  })
  @ApiResponse({
    status: 200,
    type: OmitType(User, ['password']),
    description: 'User data updated.',
  })
  async update(
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return await this.userService.update(updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  @ApiBody({
    type: String,
    description: 'Username of the user to delete. The user must be logged in.',
  })
  @HttpCode(204)
  @ApiNoContentResponse({
    description: 'Delete a user from the database.',
  })
  async delete(username: string): Promise<void> {
    return await this.userService.delete(username);
  }
}
