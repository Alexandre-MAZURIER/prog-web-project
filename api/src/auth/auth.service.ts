import { Payload } from './dto/Payload.dto';
import { RegisterDto } from './dto/Register.dto';
import { LoginDto } from './dto/Login.dto';
import { UserService } from './../user/user.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  onModuleInit(): void {
    this.logger.verbose('#onModuleInit(): initialization done');
  }

  async login(loginDto: LoginDto): Promise<any> {
    this.logger.verbose('#login(): logging user');
    const user = await this.userService.validateUser(loginDto);
    const payload = { username: user.username };
    const token = this.jwtService.sign(payload);
    return { user, token };
  }

  async register(registerDto: RegisterDto): Promise<Payload> {
    this.logger.verbose('#register(): registering user');
    const user = await this.userService.create(registerDto);
    const payload = { username: user.username };
    const token = this.jwtService.sign(payload);
    return { user, token };
  }
}
