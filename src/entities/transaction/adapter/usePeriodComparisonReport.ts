import {useQuery} from "@tanstack/react-query";
import {analyticService} from "../service/AnalyticService";
import type {RequiredPeriodComparisonFilter} from "../service/IAnalyticService";

export const getPeriodComparisonReportQueryKey = (filter: RequiredPeriodComparisonFilter) =>
  ["transactionsPeriodComparisonReport", filter.startDate, filter.endDate, filter.accountId] as const;

export const usePeriodComparisonReport = (filter: RequiredPeriodComparisonFilter) => {
  return useQuery({
    queryKey: getPeriodComparisonReportQueryKey(filter),
    queryFn: () => analyticService.getPeriodComparisonReport(filter),
    enabled: !!filter.startDate && !!filter.endDate,
  });
};
