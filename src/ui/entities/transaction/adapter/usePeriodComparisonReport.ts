import {useQuery} from "@tanstack/react-query";
import type {RequiredPeriodComparisonFilter} from "@/core/transaction/service/IAnalyticService";
import {useTransactionServices} from "./TransactionServicesProvider";

export const getPeriodComparisonReportQueryKey = (filter: RequiredPeriodComparisonFilter) =>
  ["transactionsPeriodComparisonReport", filter.startDate, filter.endDate, filter.accountId] as const;

export const usePeriodComparisonReport = (filter: RequiredPeriodComparisonFilter) => {
  const {analyticService} = useTransactionServices();
  return useQuery({
    queryKey: getPeriodComparisonReportQueryKey(filter),
    queryFn: () => analyticService.getPeriodComparisonReport(filter),
    enabled: !!filter.startDate && !!filter.endDate,
  });
};
