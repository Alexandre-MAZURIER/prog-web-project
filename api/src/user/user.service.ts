import { UpdateUserDto } from './dto/UpdateUser.dto';
import { LoginDto } from './../auth/dto/Login.dto';
import { RegisterDto } from '../auth/dto/Register.dto';
import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/User.schema';

@Injectable()
export class UserService implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  onModuleInit(): void {
    this.logger.verbose('#onModuleInit(): initialization done');
  }

  async create(registerDto: RegisterDto): Promise<Omit<User, 'password'>> {
    this.logger.verbose(`#create(): ${JSON.stringify(registerDto)}`);
    const { username } = registerDto;
    const user = await this.userModel.findOne({ username });
    if (user) {
      this.logger.error(`User ${username} already exists`);
      throw new BadRequestException('User already exists');
    }
    const createdUser = new this.userModel(registerDto);
    await createdUser.save();
    return this.sanitize(username);
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      this.logger.error(`Bad credentials for ${username}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async validateUser(loginDto: LoginDto): Promise<Omit<User, 'password'>> {
    const { username, password } = loginDto;

    this.logger.verbose(`#validateUser(): ${JSON.stringify(loginDto)}`);
    const user = await this.userModel.findOne({
      username,
      password,
    });
    if (user) {
      return this.sanitize(username);
    } else {
      this.logger.error(`Bad credentials for ${username}`);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async update(updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    this.logger.verbose(`#update(): ${JSON.stringify(updateUserDto)}`);
    const { username, oldPassword, newPassword, ...update } = updateUserDto;
    await this.userModel.findOneAndUpdate(
      { username, password: oldPassword },
      {
        password: newPassword,
        ...update,
      },
      {
        new: true,
      },
    );

    return this.sanitize(username);
  }

  async delete(username: string): Promise<void> {
    this.logger.verbose(`#delete(): ${username}`);
    await this.userModel.findOneAndDelete({ username });
  }

  private async sanitize(username: string): Promise<Omit<User, 'password'>> {
    this.logger.verbose(`#sanitize(): ${username}`);
    return await this.userModel.findOne(
      { username },
      { password: 0, _id: 0, __v: 0 },
    );
  }
}
