import { Injectable, Logger } from '@nestjs/common';
import {
  EthersContract,
  InjectContractProvider,
  InjectEthersProvider,
} from 'nestjs-ethers';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private safeTokenContract: Contract;
  private nftContract: Contract;

  constructor(
    private readonly configService: ConfigService,
    @InjectEthersProvider()
    private readonly ethersProvider: StaticJsonRpcProvider,
    @InjectContractProvider()
    private readonly localContract: EthersContract,
  ) {
    this.safeTokenContract = this.localContract.create(
      // this.configService.get('SAFE_TOKEN_ADDRESS'),
      '0xF3c420B081422C51533150664Fc8F2fb77E39296',
      // SAFE_ABI.abi,
      [
        {
          inputs: [],
          name: 'price',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
    );
  }

  start(): void {
    Logger.log(`${AppService.name} has started.`, AppService.name);
  }

  healthCheck(): string {
    return 'healthy';
  }

  getSafePrice(): string {
    this.logger.debug('requesting price from the contract');
    return this.safeTokenContract.price();
  }
}
