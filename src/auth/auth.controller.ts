import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto } from './dto/login.request.dto';
import { CreateUserDto } from 'src/user/dto/create.user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginResponseDto } from './dto/login.response.dto';

@Controller('api/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiBody({type: LoginRequestDto})
  @UseGuards(LocalAuthGuard)
  @Post('login')
  logIn(@Request() req): Promise<LoginResponseDto>{
    return this.authService.login(req.user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() registerDto: CreateUserDto) {
    return this.authService.register(registerDto);
  }
}

