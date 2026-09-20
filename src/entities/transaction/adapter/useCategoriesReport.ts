import {useQuery} from "@tanstack/react-query";
import {analyticService} from "../service/AnalyticService";
import type {TransactionsFilter} from "../service/ITransactionsService";

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
  return useQuery({
    queryKey: getCategoriesReportQueryKey(filter),
    queryFn: () => analyticService.getCategoriesReport(filter),
    enabled: !!filter.categoryType,
  });
};
