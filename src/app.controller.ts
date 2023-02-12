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
  getPrice() {
    return this.appService.getSafePrice();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/safe/balance')
  getSafeBalance(account: string) {
    return this.appService.getSafeBalance(account);
  }
  @UseInterceptors(CacheInterceptor)
  @Get('/safe/apr')
  getSafeApr() {
    return 37;
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/nft/price')
  getNftPrice() {
    return this.appService.getNftPrice();
  }
  @UseInterceptors(CacheInterceptor)
  @Get('/nft/fairPrice')
  getNftFairPrice() {
    return this.appService.getNftFairPrice();
  }
  @UseInterceptors(CacheInterceptor)
  @Get('/nft/apr')
  getNftApr() {
    return 26;
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/nft/balance')
  getNftBalance(account: string) {
    return this.appService.getNftBalance(account);
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/usdc/balance')
  getUsdcBalance(account: string) {
    return this.appService.getUsdcBalance(account);
  }
}
