import { HttpException, Injectable, Logger } from '@nestjs/common';
import {
  EthersContract,
  InjectContractProvider,
  InjectEthersProvider,
} from 'nestjs-ethers';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { ConfigService } from '@nestjs/config';
import { AddressZero } from '@ethersproject/constants';
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
import fetch from 'node-fetch';
import {
  KyberResponse,
  SwapEstimateResponse,
} from './interfaces/KyberResponse';

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

  async estimateSwap(
    estimateSwapDto: EstimateSwapDto,
  ): Promise<SwapEstimateResponse> {
    if (this.safePrice === undefined) {
      throw new HttpException(
        'Safe price is undefined. Please try again in a few minutes.',
        500,
      );
    }
    const usdcAddress = this.usdcContract.address;
    const safeAddress = this.safeTokenContract.address;

    const operation =
      estimateSwapDto.tokenOut === safeAddress
        ? estimateSwapDto.tokenIn === usdcAddress
          ? 'buySafeForExactAmountOfUSD'
          : 'preSwapWithKyberAndBuySafe'
        : estimateSwapDto.tokenIn === safeAddress
        ? estimateSwapDto.tokenOut === usdcAddress
          ? 'sellExactAmountOfSafe'
          : 'sellSafeAndPostSwapWithKyber'
        : 'unsupported-only-to-or-from-safe-token';

    this.logger.debug(`${operation}`);

    let jsonResponse: SwapEstimateResponse = {} as SwapEstimateResponse;
    jsonResponse.inputAmount = estimateSwapDto.amountIn.toString();
    jsonResponse.operation = operation;

    const getKyberResponse = async (
      estimateSwapDtoToPassToKyber: EstimateSwapDto,
    ): Promise<KyberResponse> => {
      const search = Object.keys(estimateSwapDtoToPassToKyber).reduce(
        (searchString, key) =>
          estimateSwapDtoToPassToKyber[key] !== undefined
            ? `${searchString}&${key}=${estimateSwapDtoToPassToKyber[key]}`
            : searchString,
        '',
      );
      const queryString = `https://aggregator-api.kyberswap.com/arbitrum/route/encode?${search.slice(
        1,
      )}`;
      const res = await fetch(queryString, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'accept-version': 'Latest',
        },
      });
      return res.json();
    };

    const getSafeAmountForBuySafeForExactAmountOfUSD = (
      usdAmount: string,
    ): number => {
      const usdToSpend = formatAmountFromResponse(usdAmount);
      const usdTaxBuy = usdToSpend * this.buyTax;
      const usdToSwapForSafe = usdToSpend - usdTaxBuy;
      return (usdToSwapForSafe * 1e6) / this.safePrice;
    };

    const getUSDAmountForSellExactAmountOfSafe = (
      safeAmount: string,
    ): number => {
      const safeTokensToSell = formatAmountFromResponse(safeAmount);
      const usdPriceOfTokensToSell = safeTokensToSell * this.safePrice;
      const usdTaxSell = usdPriceOfTokensToSell * this.sellTax;
      const usdToReturn = usdPriceOfTokensToSell - usdTaxSell;
      return usdToReturn * 1e6;
    };

    switch (operation) {
      case 'buySafeForExactAmountOfUSD':
        jsonResponse.outputAmount = Math.round(
          getSafeAmountForBuySafeForExactAmountOfUSD(estimateSwapDto.amountIn),
        ).toString();
        break;
      case 'sellExactAmountOfSafe':
        jsonResponse.outputAmount = Math.round(
          getUSDAmountForSellExactAmountOfSafe(estimateSwapDto.amountIn),
        ).toString();
        break;
      case 'preSwapWithKyberAndBuySafe':
        const kyberResponse = await getKyberResponse({
          ...estimateSwapDto,
          to: AddressZero,
          tokenOut: usdcAddress,
        });
        const outputAmount = Math.round(
          getSafeAmountForBuySafeForExactAmountOfUSD(
            kyberResponse.outputAmount,
          ),
        ).toString();
        jsonResponse = {
          ...kyberResponse,
          outputAmount,
          ...jsonResponse,
        };
        break;
      case 'sellSafeAndPostSwapWithKyber':
        const usdToGet = getUSDAmountForSellExactAmountOfSafe(
          estimateSwapDto.amountIn,
        );
        jsonResponse = await getKyberResponse({
          ...estimateSwapDto,
          to: process.env.SAFE_ROUTER_ADDRESS || AddressZero,
          tokenIn: usdcAddress,
          amountIn: usdToGet.toString(),
        });
        break;
      default:
        throw new HttpException('unsupported operation or token', 400);
    }

    return jsonResponse;
  }

  @Cron('*/1 * * * * *') // This cron expression runs every 5 seconds
  async handleCron() {
    await this.getSafePrice();
  }

  async getSafePrice() {
    // this.logger.debug('requesting price from the safe contract');
    const price = formatAmountFromResponse(
      await this.safeTokenContract.price(),
    );
    // if (price && this.safePrice != price)
    //   this.logger.debug(`price update: was ${this.safePrice}, now ${price}`);
    if (!isNaN(Number(price))) this.safePrice = price;
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
