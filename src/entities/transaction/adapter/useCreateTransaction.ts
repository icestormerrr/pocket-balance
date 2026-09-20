import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {Transaction} from "../model/Transaction";
import {transactionsService} from "../service/TransactionsService";
import {invalidateTransactionQueries} from "./invalidateTransactionQueries";

export const getCreateTransactionMutationKey = () => ["createTransaction"] as const;

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getCreateTransactionMutationKey(),
    mutationFn: (tx: Omit<Transaction, "id">) => transactionsService.create(tx),
    onSuccess: () => {
      invalidateTransactionQueries(queryClient);
    },
  });
};
