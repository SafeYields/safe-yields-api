import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck(): string {
    return 'healthy';
  }
  getSafePrice(): string {
    return 'Hello World!';
  }
}
