import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class About {
  @Prop()
  displayName: string;

  @Prop()
  birthday: Date;

  @Prop()
  horoscope: string;

  @Prop()
  zodiac: string;

  @Prop()
  height: number;

  @Prop()
  weight: number;

  @Prop()
  gender: string;
}

@Schema()
export class User {
  @Prop({required: true, unique: true})
  username: string;

  @Prop({required: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({type: About})
  about: About;

  @Prop()
  interests: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);