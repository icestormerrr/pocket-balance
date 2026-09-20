import {useQuery} from "@tanstack/react-query";
import {transactionsService} from "../service/TransactionsService";

export const getTransactionQueryKey = (id?: string) => ["transaction", id] as const;

export const useTransaction = (id?: string) => {
  return useQuery({
    queryKey: getTransactionQueryKey(id),
    queryFn: () => transactionsService.getById(id!),
    enabled: !!id,
  });
};
