import { Inject, Injectable } from '@nestjs/common';
import { ChatMessageRequestDto } from './dto/chat.message.request.dto';
import { Chat } from 'src/schemas/chat.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AmqpConnectionManager, ChannelWrapper, connect } from 'amqp-connection-manager'
import { ConfigService } from '@nestjs/config';
import { ChatMessagesResponseDto } from './dto/chat.messages.response.dto';

@Injectable()
export class ChatService {
  private channel: ChannelWrapper;
  private connection: AmqpConnectionManager;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
  ) {
  }

  onModuleInit() {
    this.connection = connect([`amqp://${this.configService.get<string>('RABBIT_MQ_USER')}:${this.configService.get<string>('RABBIT_MQ_PASSWORD')}@${this.configService.get<string>('RABBIT_MQ_HOST')}:${this.configService.get<number>('RABBIT_MQ_PORT')}?heartbeat=60`])
    this.channel = this.connection.createChannel({
      json: true,
      setup: function (channel) {
        return channel.assertQueue('chat_message_queue', { durable: false });
      },
    });
  }

  async sendMessage(fromUser: string, chatMessageDto: ChatMessageRequestDto): Promise<Chat> {
    const chatMessage = new this.chatModel({
      fromUser: fromUser,
      toUser: chatMessageDto.toUser,
      message: chatMessageDto.message,
      timestamp: Math.floor(new Date().getTime() / 1000)
    })

    this.channel.assertQueue(`notification_${chatMessageDto.toUser}`)
    this.channel.sendToQueue(`notification_${chatMessageDto.toUser}`, chatMessage.toJSON())

    return chatMessage.save()
  }

  async getMessages(toUser: string) {
    const result = await this.chatModel.aggregate([
      {
        $match: {
          $or: [
            { fromUser: toUser },
            { toUser: toUser },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          fromUser: 1,
          toUser: 1,
          message: 1,
          timestamp: 1,
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$fromUser', toUser] },
              { fromUser: '$fromUser', toUser: '$toUser' },
              { fromUser: '$toUser', toUser: '$fromUser' },
            ],
          },
          chats: {
            $push: {
              message: '$message',
              timestamp: '$timestamp',
            },
          },
        },
      },
      {
        $project: {
          conversations: {
            withUser: '$_id.toUser',
            chats: '$chats',
          },
        },
      },
    ]);

    const mappedResult = new ChatMessagesResponseDto;
    mappedResult.conversations = result.map(item => {
      return item.conversations
    })

    return mappedResult;
  }
}
