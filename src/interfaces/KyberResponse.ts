export type KyberSwap = {
  pool: string;
  tokenIn: string;
  tokenOut: string;
  swapAmount: string;
  amountOut: string;
  limitReturnAmount: string;
  maxPrice: string;
  exchange: string;
  poolLength: number;
  poolType: string;
  poolExtra: any;
};

export type Token = {
  address: string;
  symbol: string;
  name: string;
  price: number;
  decimals: number;
};

export type Tokens = Record<string, Token>;

export type SwapEstimateResponse = KyberResponse & {
  operation?: string;
};

export type KyberResponse = {
  inputAmount: string;
  outputAmount: string;
  totalGas: number;
  gasPriceGwei: string;
  gasUsd: number;
  amountInUsd: number;
  amountOutUsd: number;
  receivedUsd: number;
  swaps: Array<Array<KyberSwap>>;
  tokens: Tokens;
  encodedSwapData: string;
  routerAddress: string;
};
