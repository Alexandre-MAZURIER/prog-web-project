import { RegisterDto } from './dto/Register.dto';
import { LoginDto } from './dto/Login.dto';
import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth Service')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({
    type: RegisterDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User data with token.',
  })
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @ApiBody({
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User data with token.',
  })
  async login(@Body() loginDto: LoginDto): Promise<any> {
    return await this.authService.login(loginDto);
  }
}
