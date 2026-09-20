import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {Transaction} from "../model/Transaction";
import {transactionsService} from "../service/TransactionsService";
import {invalidateTransactionQueries} from "./invalidateTransactionQueries";

export const getUpdateTransactionMutationKey = () => ["updateTransaction"] as const;

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getUpdateTransactionMutationKey(),
    mutationFn: ({id, tx}: {id: string; tx: Partial<Omit<Transaction, "id">>}) => transactionsService.update(id, tx),
    onSuccess: () => {
      invalidateTransactionQueries(queryClient);
    },
  });
};
