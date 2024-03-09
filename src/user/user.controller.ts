import { Body, Controller, Get, Post, UseGuards, Request, HttpStatus, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/schemas/user.schema';
import { UserProfileDto } from './dto/user.profile.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  async getProfile(@Request() req): Promise<User> {
    return this.userService.findOneByUsernameOrEmail(req.user.username);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('profile')
  async updateProfile(
    @Body() updateProfileDto: UserProfileDto,
    @Request() req): Promise<any> {
    return this.userService.createOrupdateProfile(req.user.username, updateProfileDto)
  }
}
