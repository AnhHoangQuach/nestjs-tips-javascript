import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { MyLoggerDev } from 'src/logger/my.logger.dev';

@Module({
  imports: [UserModule, DbModule],
  controllers: [AppController],
  providers: [AppService, MyLoggerDev],
})
export class AppModule {}
