import { LoginDto } from './../auth/dto/Login.dto';
import { RegisterDto } from '../auth/dto/Register.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
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

  async create(registerDto: RegisterDto): Promise<Partial<User>> {
    this.logger.verbose(`#create(): ${JSON.stringify(registerDto)}`);
    const { username } = registerDto;
    const user = await this.userModel.findOne({ username });
    if (user) {
      this.logger.error(`User ${username} already exists`);
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const createdUser = new this.userModel(registerDto);
    await createdUser.save();
    return this.sanitize(username);
  }

  async validateUser(loginDto: LoginDto): Promise<Partial<User>> {
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
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async update(user: User): Promise<User> {
    this.logger.verbose(`#update(): ${JSON.stringify(user)}`);
    const { username, ...update } = user;
    await this.userModel.findOneAndUpdate({ username }, update, {
      new: true,
    });

    return this.sanitize(username);
  }

  async delete(user: User): Promise<void> {
    this.logger.verbose(`#delete(): ${JSON.stringify(user)}`);
    const { username } = user;
    await this.userModel.findOneAndDelete({ username });
  }

  private async sanitize(username: string): Promise<User> {
    this.logger.verbose(`#sanitize(): ${username}`);
    return await this.userModel.findOne(
      { username },
      { password: 0, _id: 0, __v: 0 },
    );
  }
}
