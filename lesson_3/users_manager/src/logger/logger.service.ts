import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_OPTIONS, LoggerModuleOptions } from './logger.module';
import { APP_CONFIG, AppConfig } from '../config/config.module';

@Injectable()
export class LoggerService {
  private readonly logLevel: string;
  private readonly levels: Record<string, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(
    @Inject(LOGGER_OPTIONS) private readonly options: LoggerModuleOptions,
    @Inject(APP_CONFIG) private readonly appConfig: AppConfig,
  ) {
    this.logLevel = options.logLevel;
  }

  private shouldLog(level: string): boolean {
    if (!this.appConfig.debug) {
      return false;
    }
    return this.levels[level] >= this.levels[this.logLevel];
  }

  debug(message: string): void {
    if (this.shouldLog('debug')) {
      console.log(`[DEBUG]: ${message}`);
    }
  }

  info(message: string): void {
    if (this.shouldLog('info')) {
      console.log(`[INFO]: ${message}`);
    }
  }

  warn(message: string): void {
    if (this.shouldLog('warn')) {
      console.log(`[WARN]: ${message}`);
    }
  }

  error(message: string): void {
    if (this.shouldLog('error')) {
      console.log(`[ERROR]: ${message}`);
    }
  }
}
