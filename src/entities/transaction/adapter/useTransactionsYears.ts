import {useQuery} from "@tanstack/react-query";
import {analyticService} from "../service/AnalyticService";

export const getTransactionsYearsQueryKey = () => ["transactionsYears"] as const;

export const useTransactionsYears = () => {
  return useQuery({
    queryKey: getTransactionsYearsQueryKey(),
    queryFn: () => analyticService.getUniqYears(),
  });
};
