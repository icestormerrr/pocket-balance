import {useQuery} from "@tanstack/react-query";
import {useTransactionServices} from "./TransactionServicesProvider";

export const getTransactionsYearsQueryKey = () => ["transactionsYears"] as const;

export const useTransactionsYears = () => {
  const {analyticService} = useTransactionServices();
  return useQuery({
    queryKey: getTransactionsYearsQueryKey(),
    queryFn: () => analyticService.getUniqYears(),
  });
};
