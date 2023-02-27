import {
  CacheInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  healthCheck(): string {
    return this.appService.healthCheck();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/safe/price')
  getPrice(): Promise<string> {
    return this.appService.getSafePrice();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/safe/balance')
  getSafeBalance(account: string): Promise<string> {
    return this.appService.getSafeBalance(account);
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/safe/apr')
  getSafeApr(): string {
    return '37.3';
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/nft/price')
  getNftPrice(): Promise<[string, string, string, string]> {
    return this.appService.getNftPrice();
  }
  @UseInterceptors(CacheInterceptor)
  @Get('/nft/presale-price')
  getNftPresalePrice(): Promise<[string, string, string, string]> {
    return this.appService.getNftPresalePrice();
  }
  @UseInterceptors(CacheInterceptor)
  @Get('/nft/available')
  getPresaleNFTAvailable(): Promise<[string, string, string, string]> {
    return this.appService.getPresaleNFTAvailable();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/nft/presale')
  getPresaleLaunchDate(): Promise<string> {
    return this.appService.getPresaleLaunchDate();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/nft/week')
  getCurrentPresaleWeel(): Promise<number> {
    return this.appService.getCurrentPresaleWeek();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/nft/apr')
  getNftApr(): string {
    return '26.7';
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/nft/balance')
  getNftBalance(account: string): Promise<string> {
    return this.appService.getNftBalance(account);
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/usdc/balance')
  getUsdcBalance(account: string): Promise<string> {
    return this.appService.getUsdcBalance(account);
  }
}
