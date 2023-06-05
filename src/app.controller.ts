import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { EstimateSwapDto } from './estimate-swap.dto';
import {
  KyberResponse,
  SwapEstimateResponse,
} from './interfaces/KyberResponse';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  healthCheck(): string {
    return this.appService.healthCheck();
  }

  @Get('/swap/estimate')
  async estimateSwap(
    @Query() estimateSwapDto: EstimateSwapDto,
  ): Promise<SwapEstimateResponse> {
    return this.appService.estimateSwap(estimateSwapDto);
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
    return '62';
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/nft/price')
  getNftPrice(): Promise<[string, string, string, string]> {
    return this.appService.getNftPrice();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/nft/available')
  getPresaleNFTAvailable(): Promise<[string, string, string, string]> {
    return this.appService.getNFTSupplyAvailable();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/nft/apr')
  getNftApr(): string {
    return '32';
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

  @Post('/distribute')
  async distribute(@Body('key') key: string): Promise<any> {
    return this.appService.distributeProfit(key);
  }
}
