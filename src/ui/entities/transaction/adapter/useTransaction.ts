import {useQuery} from "@tanstack/react-query";
import {useTransactionServices} from "./TransactionServicesProvider";

export const getTransactionQueryKey = (id?: string) => ["transaction", id] as const;

export const useTransaction = (id?: string) => {
  const {transactionsService} = useTransactionServices();
  return useQuery({
    queryKey: getTransactionQueryKey(id),
    queryFn: () => transactionsService.getById(id!),
    enabled: !!id,
  });
};
