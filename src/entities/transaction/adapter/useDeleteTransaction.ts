import {useMutation, useQueryClient} from "@tanstack/react-query";
import {transactionsService} from "../service/TransactionsService";
import {invalidateTransactionQueries} from "./invalidateTransactionQueries";

export const getDeleteTransactionMutationKey = () => ["deleteTransaction"] as const;

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getDeleteTransactionMutationKey(),
    mutationFn: (id: string) => transactionsService.delete(id),
    onSuccess: () => {
      invalidateTransactionQueries(queryClient);
    },
  });
};
