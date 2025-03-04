import { UserWalletHistoryResponseDto } from 'libs/dto';
import { TRANSACTION_TYPE } from 'libs/enums';
import { BlocktrempCreditHistory } from 'libs/typeorm';

export const toUserWalletHistoryDto = (
  walletHistory: BlocktrempCreditHistory,
): UserWalletHistoryResponseDto => {
  return {
    transactionType:
      walletHistory.amount > 0
        ? TRANSACTION_TYPE.CREDIT
        : TRANSACTION_TYPE.DEBIT,
    date: walletHistory.createdAt as unknown as string,
    balance: walletHistory.amount,
  };
};
