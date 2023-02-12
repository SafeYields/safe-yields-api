import { Injectable, Logger } from "@nestjs/common";
import { EthersContract, InjectContractProvider, InjectEthersProvider } from "nestjs-ethers";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { ConfigService } from "@nestjs/config";
import * as SAFE_ABI from "./artifacts/contracts/SafeToken.sol/SafeToken.json";

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
    private readonly localContract: EthersContract
  ) {
    this.safeTokenContract = this.localContract.create(
      this.configService.get("SAFE_TOKEN_ADDRESS"),
      // '0xF3c420B081422C51533150664Fc8F2fb77E39296',
      SAFE_ABI.abi
    );
  }

  start(): void {
    Logger.log(`${AppService.name} has started.`, AppService.name);
  }

  healthCheck(): string {
    return "healthy";
    ';
  }

  getSafePrice(): string {
    this.logger.debug("requesting price from the safe contract");
    return this.safeTokenContract.price();
  }

  getSafeBalance(address: string): string {
    this.logger.debug("requesting user balance from the contract");
    return this.safeTokenContract.price();
  }
}
