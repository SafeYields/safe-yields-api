import { Injectable, Logger } from '@nestjs/common';
import {
  EthersContract,
  InjectContractProvider,
  InjectEthersProvider,
} from 'nestjs-ethers';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { ConfigService } from '@nestjs/config';
import * as SAFE_TOKEN_ABI from './artifacts/contracts/SafeToken.sol/SafeToken.json';
import * as SAFE_NFT_ABI from './artifacts/contracts/SafeNFT.sol/SafeNFT.json';
import * as USDC_ABI from './artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json';
import { formatAmountFromResponseToString } from './utils/formatAmountFromResponseToString';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private safeTokenContract: Contract;
  private safeNFTContract: Contract;
  private usdcContract: Contract;

  constructor(
    private readonly configService: ConfigService,
    @InjectEthersProvider()
    private readonly ethersProvider: StaticJsonRpcProvider,
    @InjectContractProvider()
    private readonly localContract: EthersContract,
  ) {
    this.safeTokenContract = this.localContract.create(
      this.configService.get('SAFE_TOKEN_ADDRESS'),
      SAFE_TOKEN_ABI.abi,
    );
    this.safeNFTContract = this.localContract.create(
      this.configService.get('SAFE_NFT_ADDRESS'),
      SAFE_NFT_ABI.abi,
    );
    this.usdcContract = this.localContract.create(
      this.configService.get('USDC_ADDRESS'),
      USDC_ABI.abi,
    );
  }

  start(): void {
    Logger.log(`${AppService.name} has started.`, AppService.name);
  }

  healthCheck(): string {
    return 'healthy';
  }

  async getSafePrice() {
    this.logger.debug('requesting price from the safe contract');
    return formatAmountFromResponseToString(
      await this.safeTokenContract.price(),
    );
  }

  async getSafeBalance(address: string) {
    this.logger.debug('requesting user balance from the contract');
    return formatAmountFromResponseToString(
      await this.safeTokenContract.balanceOf(address),
    );
  }

  async getNftPrice() {
    this.logger.debug('requesting the blockchain');
    return (await this.safeNFTContract.getPriceTable()).map((value) =>
      formatAmountFromResponseToString(value, 6),
    );
  }
  async getNftPresalePrice() {
    this.logger.debug('requesting the blockchain');
    return (await this.safeNFTContract.getDiscountedPriceTable()).map((value) =>
      formatAmountFromResponseToString(value, 6),
    );
  }

  async getPresaleNFTAvailable() {
    this.logger.debug('requesting the blockchain');
    return (await this.safeNFTContract.getPresaleNFTAvailable()).map((value) =>
      formatAmountFromResponseToString(value, 0),
    );
  }

  async getNftFairPrice() {
    return (await this.safeNFTContract.getFairPriceTable()).map((value) =>
      formatAmountFromResponseToString(value, 6),
    );
  }

  async getPresaleLaunchDate() {
    return await this.safeNFTContract.presaleStartDate();
  }

  async getCurrentPresaleWeek() {
    return await this.safeNFTContract.getCurrentPresaleWeek();
  }

  async getNftBalance(address: string) {
    return (await this.safeNFTContract.getBalanceTable(address))?.map((value) =>
      formatAmountFromResponseToString(value, 0, 0),
    );
  }

  async getUsdcBalance(address: string) {
    return formatAmountFromResponseToString(
      await this.usdcContract.balanceOf(address),
    );
  }
}
