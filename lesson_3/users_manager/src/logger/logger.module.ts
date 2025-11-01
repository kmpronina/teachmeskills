import { DynamicModule, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { ConfigModule, AppConfig } from '../config/config.module';

export const LOGGER_OPTIONS = 'LOGGER_OPTIONS';

export interface LoggerModuleOptions {
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  config?: AppConfig;
}

@Module({})
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions): DynamicModule {
    const imports = options.config
      ? [ConfigModule.forRoot(options.config)]
      : [ConfigModule];

    return {
      module: LoggerModule,
      global: true,
      imports,
      providers: [
        {
          provide: LOGGER_OPTIONS,
          useValue: { logLevel: options.logLevel },
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }
}
