import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('AutoStore example')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('store')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // mongoose.set('debug', true);
  
  await app.listen(3000);
}
bootstrap();
