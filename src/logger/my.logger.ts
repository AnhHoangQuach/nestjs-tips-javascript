import { LoggerService, LogLevel } from '@nestjs/common';
import chalk from 'chalk';
import * as dayjs from 'dayjs';
import { createLogger, format, Logger, transports } from 'winston';

export class MyLogger implements LoggerService {
  private logger: Logger;
  constructor() {
    this.logger = createLogger({
      level: 'debug',
      // format: format.combine(
      //   format.colorize(),
      //   format.timestamp(),
      //   format.simple(),
      // ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.timestamp(),
            format.printf(({ context, message, level, time }) => {
              const strApp = chalk.green('[Nest]');
              const strContext = chalk.yellow(`[${context}]`);
              return `${strApp} - ${time} ${level} ${strContext} ${message}`;
            }),
          ),
        }),
        new transports.File({
          filename: 'demo.dev.log',
          dirname: 'log',
          format: format.combine(format.timestamp(), format.json()),
        }),
      ],
    });
  }

  log(message: string, context: string) {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('info', message, { context, time });
    // console.log(`****INFO****[${context}] | `, message);
  }
  error(message: string, context: string) {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('error', message, { context, time });
  }
  warn(message: string, context: string) {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('warn', message, { context, time });
  }
  debug?(message: string, context: string) {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('debug', message, { context, time });
  }
  verbose?(message: string, context: string) {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('verbose', message, { context, time });
  }
  fatal?(message: string, context: string) {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('info', message, { context, time });
  }
  setLogLevels?(levels: LogLevel[]) {
    // console.log(`****INFO****[${context}] | `, message);
  }
}
