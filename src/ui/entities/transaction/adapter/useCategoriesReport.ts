import {useQuery} from "@tanstack/react-query";
import type {TransactionsFilter} from "@/core/transaction/service/ITransactionsService";
import {useTransactionServices} from "./TransactionServicesProvider";

export const getCategoriesReportQueryKey = (filter: TransactionsFilter) =>
  [
    "transactionsCategoriesReport",
    filter.startDate,
    filter.endDate,
    filter.categoryType,
    filter.accountId,
    filter.categoryId,
    filter.excludeTransfers,
  ] as const;

export const useCategoriesReport = (filter: TransactionsFilter) => {
  const {analyticService} = useTransactionServices();
  return useQuery({
    queryKey: getCategoriesReportQueryKey(filter),
    queryFn: () => analyticService.getCategoriesReport(filter),
    enabled: !!filter.categoryType,
  });
};
