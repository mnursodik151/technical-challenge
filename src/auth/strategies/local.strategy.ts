import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'usernameOrEmail',
      passwordField: 'password',
    });
  }

  async validate(usernameOrEmail: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(usernameOrEmail, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}