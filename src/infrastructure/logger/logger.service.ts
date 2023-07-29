import { Injectable, Logger } from '@nestjs/common';
import { ILogger } from '../../domain/logger/logger.interface';

import { transports, format, createLogger } from 'winston';

export const winstonLogger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/warn.log', level: 'warn' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

@Injectable()
export class LoggerService extends Logger implements ILogger {
  debug(context: string, message: string) {
    if (process.env.NODE_ENV !== 'production') {
      super.debug(`[DEBUG] ${message}`, context);
      winstonLogger.debug(`[DEBUG] ${message}`, context);
    }
  }
  log(context: string, message: string) {
    super.log(`[INFO] ${message}`, context);
    winstonLogger.info(`[INFO] ${message}`, context);
  }
  error(context: string, message: string, trace?: string) {
    super.error(`[ERROR] ${message}`, trace, context);
    winstonLogger.error(`[ERROR] ${message}`, trace, context);
  }
  warn(context: string, message: string) {
    super.warn(`[WARN] ${message}`, context);
    winstonLogger.warn(`[WARN] ${message}`, context);
  }
  verbose(context: string, message: string) {
    if (process.env.NODE_ENV !== 'production') {
      super.verbose(`[VERBOSE] ${message}`, context);
      winstonLogger.verbose(`[VERBOSE] ${message}`, context);
    }
  }
}
