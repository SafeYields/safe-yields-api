import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
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
    return '--';
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
  getPresaleLaunchDate(): Promise<number> {
    return this.appService.getPresaleLaunchDate();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/nft/week')
  getCurrentPresaleWeek(): Promise<number> {
    return this.appService.getCurrentPresaleWeek();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/nft/apr')
  getNftApr(): string {
    return '30.38';
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
