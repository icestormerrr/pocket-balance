import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {Transaction} from "@/core/transaction/domain/Transaction";
import {invalidateTransactionQueries} from "./invalidateTransactionQueries";
import {useTransactionServices} from "./TransactionServicesProvider";

export const getUpdateTransactionMutationKey = () => ["updateTransaction"] as const;

export const useUpdateTransaction = () => {
  const {transactionsService} = useTransactionServices();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getUpdateTransactionMutationKey(),
    mutationFn: ({id, tx}: {id: string; tx: Partial<Omit<Transaction, "id">>}) => transactionsService.update(id, tx),
    onSuccess: () => {
      invalidateTransactionQueries(queryClient);
    },
  });
};
