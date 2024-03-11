import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get<string>('MONGO_EXPRESS_LOGIN')}:${configService.get<string>('MONGO_EXPRESS_PASSWORD')}@${configService.get<string>('MONGO_DB_HOST')}:${configService.get<number>('MONGO_DB_PORT')}/${configService.get<string>('MONGO_DB_DATABASE')}`,
      }),
      inject: [ConfigService],
    }),    

    UserModule,
    AuthModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
