import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginRequestDto } from './dto/login.request.dto';
import { CreateUserDto } from 'src/user/dto/create.user.dto';
import { User } from 'src/schemas/user.schema';
import { LoginResponseDto } from './dto/login.response.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    ) {}

  async register(dto: CreateUserDto):Promise<User> {
    return this.userService.create(dto)
  }

  async validateUser(usernameOrEmail: string, password: string): Promise<User | null> {
    const user = await this.userService.findOneByUsernameOrEmail(usernameOrEmail);
    if (this.userService.verifyPassword(user, password)) {
      return user
    }
    return null;
  }

  async login(user: User): Promise<LoginResponseDto> {
    const {password, ...payload} = user
    return {
      username: user.username,
      email: user.email,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
