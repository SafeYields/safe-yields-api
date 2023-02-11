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
  @Get('/safe-price')
  getPrice(): string {
    return this.appService.getSafePrice();
  }
}
