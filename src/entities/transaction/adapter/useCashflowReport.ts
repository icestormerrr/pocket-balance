import {useQuery} from "@tanstack/react-query";
import {analyticService} from "../service/AnalyticService";

export const getCashflowReportQueryKey = ({
  startDate,
  endDate,
  accountId,
  granularity,
}: {
  startDate?: string;
  endDate?: string;
  accountId?: string;
  granularity: "month" | "day";
}) => ["transactionsCashflowReport", startDate, endDate, accountId, granularity] as const;

export const useCashflowReport = ({
  startDate,
  endDate,
  accountId,
  granularity,
}: {
  startDate?: string;
  endDate?: string;
  accountId?: string;
  granularity: "month" | "day";
}) => {
  return useQuery({
    queryKey: getCashflowReportQueryKey({startDate, endDate, accountId, granularity}),
    queryFn: () => analyticService.getCashflowReport({startDate, endDate, accountId, granularity}),
  });
};
