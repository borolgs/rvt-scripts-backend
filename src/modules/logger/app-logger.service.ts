import { createLogger, format, transports, config, Logger } from 'winston';

import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class AppLogger implements LoggerService {
  private logger: Logger;
  constructor() {
    this.logger = createLogger({
      transports: [new transports.Console()],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
