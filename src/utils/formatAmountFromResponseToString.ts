import { BigNumberish } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';

export const formatAmountFromResponseToString = (
  value: BigNumberish,
  decimals = 6,
  decimalsToDisplay = 5,
) => formatAmountFromResponse(value, decimals).toFixed(decimalsToDisplay);

export const formatAmountFromResponse = (value: BigNumberish, decimals = 6) =>
  parseFloat(formatUnits(value, decimals));

export const formatAmountToString = (value: number, decimalsToDisplay = 5) =>
  value.toFixed(decimalsToDisplay);
