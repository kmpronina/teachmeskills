import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_OPTIONS, LoggerModuleOptions } from './logger.module';
import { APP_CONFIG, AppConfig } from '../config/config.module';

@Injectable()
export class LoggerService {
  private readonly logLevel: string;

  constructor(
    @Inject(LOGGER_OPTIONS) private readonly options: LoggerModuleOptions,
    @Inject(APP_CONFIG) private readonly appConfig: AppConfig,
  ) {}

  log(message: string) {
    if (this.appConfig.debug) {
      console.log(`[${this.options.logLevel.toUpperCase()}]: ${message}`);
    }
  }
}
