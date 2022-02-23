import { RegisterDto } from './dto/Register.dto';
import { LoginDto } from './dto/Login.dto';
import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Payload } from './dto/Payload.dto';

@ApiTags('Auth Service')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({
    type: RegisterDto,
    description: 'User data to register.',
  })
  @ApiResponse({
    status: 200,
    type: Payload,
    description: 'User data with token.',
  })
  async register(@Body() registerDto: RegisterDto): Promise<Payload> {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @ApiBody({
    type: LoginDto,
    description: 'User data to login.',
  })
  @ApiResponse({
    status: 200,
    type: Payload,
    description: 'User data with token.',
  })
  async login(@Body() loginDto: LoginDto): Promise<Payload> {
    return await this.authService.login(loginDto);
  }
}
