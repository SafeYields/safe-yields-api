import { BigNumberish } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';

export const formatAmountFromResponseToString = (
  value: BigNumberish,
  decimals = 6,
  decimalsToDisplay = 2,
) => parseFloat(formatUnits(value, decimals)).toFixed(decimalsToDisplay);
