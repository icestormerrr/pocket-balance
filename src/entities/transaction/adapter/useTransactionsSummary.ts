import {useQuery} from "@tanstack/react-query";
import {analyticService} from "../service/AnalyticService";
import type {TransactionsFilter} from "../service/ITransactionsService";

export const getTransactionsSummaryQueryKey = (filter: TransactionsFilter) =>
  [
    "transactionsSummary",
    filter.startDate,
    filter.endDate,
    filter.categoryType,
    filter.accountId,
    filter.categoryId,
    filter.excludeTransfers,
  ] as const;

export const useTransactionsSummary = (filter: TransactionsFilter) => {
  return useQuery({
    queryKey: getTransactionsSummaryQueryKey(filter),
    queryFn: () => analyticService.getSummary(filter),
  });
};
