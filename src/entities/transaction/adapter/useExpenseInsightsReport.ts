import {useQuery} from "@tanstack/react-query";
import {analyticService} from "../service/AnalyticService";
import type {TransactionsFilter} from "../service/ITransactionsService";

export const getExpenseInsightsReportQueryKey = (filter: TransactionsFilter) =>
  ["transactionsExpenseInsightsReport", filter.startDate, filter.endDate, filter.accountId] as const;

export const useExpenseInsightsReport = (filter: TransactionsFilter) => {
  return useQuery({
    queryKey: getExpenseInsightsReportQueryKey(filter),
    queryFn: () => analyticService.getExpenseInsightsReport(filter),
  });
};
