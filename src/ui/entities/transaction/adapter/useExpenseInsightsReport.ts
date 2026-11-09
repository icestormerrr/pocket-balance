import {useQuery} from "@tanstack/react-query";
import type {TransactionsFilter} from "@/core/transaction/service/ITransactionsService";
import {useTransactionServices} from "./TransactionServicesProvider";

export const getExpenseInsightsReportQueryKey = (filter: TransactionsFilter) =>
  ["transactionsExpenseInsightsReport", filter.startDate, filter.endDate, filter.accountId] as const;

export const useExpenseInsightsReport = (filter: TransactionsFilter) => {
  const {analyticService} = useTransactionServices();
  return useQuery({
    queryKey: getExpenseInsightsReportQueryKey(filter),
    queryFn: () => analyticService.getExpenseInsightsReport(filter),
  });
};
