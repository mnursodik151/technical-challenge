import { Body, Controller, Get, Post, UseGuards, Request, HttpStatus, HttpCode, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { ChatMessageRequestDto } from './dto/chat.message.request.dto';
import { ChatMessagesResponseDto } from './dto/chat.messages.response.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Chat')
@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @HttpCode(HttpStatus.OK)
  @Post('messages')
  async sendMessage(
    @Body() chatMessageDto: ChatMessageRequestDto,
    @Request() req): Promise<any> {
      return this.chatService.sendMessage(req.user.username, chatMessageDto)
  }

  @HttpCode(HttpStatus.OK)
  @Get('messages')
  async getAllMessages(
    @Request() req): Promise<any> {
    return this.chatService.getMessages(req.user.username);
  }
}
