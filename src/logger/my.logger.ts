import { LoggerService, LogLevel } from '@nestjs/common';

export class MyLogger implements LoggerService {
  log(message: string, context: string) {
    console.log(`****INFO****[${context}] | `, message);
  }
  error(message: string, context: string) {
    console.log(`****INFO****[${context}] | `, message);
  }
  warn(message: string, context: string) {
    console.log(`****INFO****[${context}] | `, message);
  }
  debug?(message: string, context: string) {
    console.log(`****INFO****[${context}] | `, message);
  }
  verbose?(message: string, context: string) {
    console.log(`****INFO****[${context}] | `, message);
  }
  fatal?(message: string, context: string) {
    console.log(`****INFO****[${context}] | `, message);
  }
  setLogLevels?(levels: LogLevel[]) {
    // console.log(`****INFO****[${context}] | `, message);
  }
}
