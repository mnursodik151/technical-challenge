import { User } from "src/schemas/user.schema"

export class LoginResponseDto {
  username: string;
  email: string;
  accessToken: string;
}