import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop({required: true})
  fromUser: string

  @Prop({required: true})
  toUser: string

  @Prop({required: true})
  message: string

  @Prop({required: true})
  timestamp: number
}

export const ChatSchema = SchemaFactory.createForClass(Chat);