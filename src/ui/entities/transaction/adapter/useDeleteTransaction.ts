import {useMutation, useQueryClient} from "@tanstack/react-query";
import {invalidateTransactionQueries} from "./invalidateTransactionQueries";
import {useTransactionServices} from "./TransactionServicesProvider";

export const getDeleteTransactionMutationKey = () => ["deleteTransaction"] as const;

export const useDeleteTransaction = () => {
  const {transactionsService} = useTransactionServices();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getDeleteTransactionMutationKey(),
    mutationFn: (id: string) => transactionsService.delete(id),
    onSuccess: () => {
      invalidateTransactionQueries(queryClient);
    },
  });
};
