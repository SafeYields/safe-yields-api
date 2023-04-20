import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';

export class EstimateSwapDto {
  @IsString()
  @IsNotEmpty()
  tokenIn: string;
  @IsString()
  @IsNotEmpty()
  tokenOut: string;

  @IsString()
  @IsNotEmpty()
  amountIn: string;

  @IsNumber()
  @IsOptional()
  saveGas: number;

  @IsNumber()
  @IsOptional()
  gasInclude: number;

  @IsNumber()
  @IsOptional()
  slippageTolerance: number;

  @IsNumber()
  @IsOptional()
  deadline: number;

  @IsString()
  @IsOptional()
  to: string;

  @IsString()
  @IsOptional()
  clientData: string;

  @IsString()
  @IsOptional()
  chargeFeeBy: string;

  @IsNumber()
  @IsOptional()
  feeAmount: number;

  @IsBoolean()
  @IsOptional()
  isInBps: boolean;

  @IsString()
  @IsOptional()
  feeReceiver: string;
}
