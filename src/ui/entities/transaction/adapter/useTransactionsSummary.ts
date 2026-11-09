import {useQuery} from "@tanstack/react-query";
import type {TransactionsFilter} from "@/core/transaction/service/ITransactionsService";
import {useTransactionServices} from "./TransactionServicesProvider";

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
  const {analyticService} = useTransactionServices();
  return useQuery({
    queryKey: getTransactionsSummaryQueryKey(filter),
    queryFn: () => analyticService.getSummary(filter),
  });
};
