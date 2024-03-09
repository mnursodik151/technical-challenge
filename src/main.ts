import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = app.get<ConfigService>(ConfigService);

  // swagger
  const title = `${config.getOrThrow<string>('APP_NAME')} API Documentation`;

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle(title)
      .setDescription('Technical challenge app for auth, profile and chat')
      .setVersion('1.0')
      .addBearerAuth()
      .build(),
  );

  SwaggerModule.setup('swagger', app, document, {
    customCss: '.topbar { display: none !important; }',
    customSiteTitle: title,
    swaggerOptions: {
      docExpansion: 'none',
    },
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const server = await app.listen(
    config.getOrThrow<number>('APP_PORT'),
    '0.0.0.0',
    async () => {
      console.log(`Application is running on: ${await app.getUrl()}`);
    },
  );

  server.setTimeout(1800000);
}
bootstrap();
