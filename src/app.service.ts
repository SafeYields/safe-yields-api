import { Injectable } from '@nestjs/common';
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

  healthCheck(): string {
    return 'healthy';
  }

  getSafePrice(): string {
    return this.safeTokenContract.price();
  }
}
