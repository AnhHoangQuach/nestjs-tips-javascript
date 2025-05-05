import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { MyLogger } from 'src/logger/my.logger';
import { AppModule } from './app.module';
import { MyLoggerDev } from 'src/logger/my.logger.dev';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger: new MyLogger(),
    bufferLogs: true,
  });
  app.useLogger(app.get(MyLoggerDev));
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  //
  app.useStaticAssets(join(__dirname, '../uploads'), { prefix: '/uploads' });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
