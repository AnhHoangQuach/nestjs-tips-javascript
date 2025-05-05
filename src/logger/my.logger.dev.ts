import { ConsoleLogger } from '@nestjs/common';

export class MyLoggerDev extends ConsoleLogger {
  log(message: string, context: string) {
    console.log(`[${context}] | `, message);
  }
}
