import {useQuery} from "@tanstack/react-query";
import type {TransactionsFilter} from "../service/ITransactionsService";
import {transactionsService} from "../service/TransactionsService";

export const getTransactionsQueryKey = (filter: TransactionsFilter) =>
  [
    "transactions",
    filter.startDate,
    filter.endDate,
    filter.categoryType,
    filter.accountId,
    filter.categoryId,
    filter.excludeTransfers,
  ] as const;

export const useTransactions = (filter: TransactionsFilter) => {
  return useQuery({
    queryKey: getTransactionsQueryKey(filter),
    queryFn: () => transactionsService.getAll(filter),
  });
};
