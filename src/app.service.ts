import { HttpException, Injectable, Logger } from '@nestjs/common';
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
import {
  formatAmountFromResponse,
  formatAmountFromResponseToString,
  formatAmountToString,
} from './utils/formatAmountFromResponseToString';
import { EstimateSwapDto } from './estimate-swap.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private safeTokenContract: Contract;
  private safeNFTContract: Contract;
  private usdcContract: Contract;

  private safePrice: number;
  private buyTax = 0.0025;
  private sellTax = 0.0025;

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

  async estimateSwap(estimateSwapDto: EstimateSwapDto) {
    // const search = Object.keys(estimateSwapDto).reduce(
    //   (searchString, key) =>
    //     estimateSwapDto[key] !== undefined
    //       ? `${searchString}&${key}=${estimateSwapDto[key]}`
    //       : searchString,
    //   '',
    // );
    // const res = await fetch(
    //   `https://aggregator-api.kyberswap.com/arbitrum/route/encode?${search.slice(
    //     1,
    //   )}`,
    //   {
    //     headers: {
    //       'accept-version': 'Latest',
    //     },
    //   },
    // );
    const operation =
      estimateSwapDto.tokenIn === this.usdcContract.address &&
      estimateSwapDto.tokenOut === this.safeTokenContract.address
        ? 'buySafeForExactAmountOfUSD'
        : estimateSwapDto.tokenIn === this.safeTokenContract.address &&
          estimateSwapDto.tokenOut === this.usdcContract.address
        ? 'sellExactAmountOfSafe'
        : 'unsupported';

    let amountOut = 0;
    this.logger.debug(`${operation}`);
    switch (operation) {
      case 'buySafeForExactAmountOfUSD':
        const usdToSpend = formatAmountFromResponse(estimateSwapDto.amountIn);
        const usdTaxBuy = usdToSpend * this.buyTax;
        const usdToSwapForSafe = usdToSpend - usdTaxBuy;
        const safeTokensToBuy = (usdToSwapForSafe * 1e6) / this.safePrice;
        amountOut = safeTokensToBuy;
        break;
      case 'sellExactAmountOfSafe':
        const safeTokensToSell = formatAmountFromResponse(
          estimateSwapDto.amountIn,
        );
        const usdPriceOfTokensToSell = safeTokensToSell * this.safePrice;
        const usdTaxSell = usdPriceOfTokensToSell * this.sellTax;
        const usdToReturn = usdPriceOfTokensToSell - usdTaxSell;
        amountOut = usdToReturn * 1e6;
        break;
      default:
        throw new HttpException('unsupported token', 400);
    }

    return {
      amountInUsd: 0,
      amountOutUsd: 0,
      encodedSwapData: '',
      gasUsd: 0,
      inputAmount: estimateSwapDto.tokenIn.toString(),
      outputAmount: Math.round(amountOut).toString(),
      routerAddress: '',
    };
  }

  @Cron('*/5 * * * * *') // This cron expression runs every 5 seconds
  async handleCron() {
    await this.getSafePrice();
  }

  async getSafePrice() {
    this.logger.debug('requesting price from the safe contract');
    const price = formatAmountFromResponse(
      await this.safeTokenContract.price(),
    );
    if (!isNaN(Number(price))) this.safePrice = price;
    this.logger.debug(`price ${this.safePrice}`);
    return formatAmountToString(this.safePrice);
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
    return (await this.safeNFTContract.presaleStartDate()).toNumber();
  }

  async getCurrentPresaleWeek() {
    return (await this.safeNFTContract.getCurrentPresaleWeek()).toNumber();
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
