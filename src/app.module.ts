import { ethers, providers } from 'ethers';
import { CacheModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EthersModule } from 'nestjs-ethers';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './utils/logger.middleware';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    CacheModule.register(),
    EthersModule.forRootAsync({
      imports: [ConfigModule, ScheduleModule.forRoot()],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          custom: config.get('CHAIN_URL'),
          useDefaultProvider: false,
          network: {
            name: 'arbitrum-mainnet',
            chainId: 42161, // Arbitrum Mainnet Chain ID
            // ensAddress: '',  // Optional, only if ENS is supported
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
