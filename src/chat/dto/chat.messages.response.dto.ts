import { Chat } from "src/schemas/chat.schema";

export class ChatMessagesResponseDto {
  conversations: Conversation[]
}

class Conversation {
  withUser: string

  chats: Chat[]
}