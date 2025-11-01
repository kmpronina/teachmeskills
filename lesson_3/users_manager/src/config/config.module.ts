import { DynamicModule, Module } from '@nestjs/common';

export const APP_CONFIG = 'APP_CONFIG';

export interface AppConfig {
  debug: boolean;
}

@Module({})
export class ConfigModule {
  static forRoot(config: AppConfig): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: APP_CONFIG,
          useValue: config,
        },
      ],
      exports: [APP_CONFIG],
    };
  }
}
