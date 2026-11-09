import {useQuery} from "@tanstack/react-query";
import {useTransactionServices} from "./TransactionServicesProvider";

export const getAccountFlowReportQueryKey = ({startDate, endDate}: {startDate?: string; endDate?: string}) =>
  ["transactionsAccountFlowReport", startDate, endDate] as const;

export const useAccountFlowReport = ({startDate, endDate}: {startDate?: string; endDate?: string}) => {
  const {analyticService} = useTransactionServices();
  return useQuery({
    queryKey: getAccountFlowReportQueryKey({startDate, endDate}),
    queryFn: () => analyticService.getAccountFlowReport({startDate, endDate}),
  });
};
