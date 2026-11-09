import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {Transaction} from "@/core/transaction/domain/Transaction";
import {invalidateTransactionQueries} from "./invalidateTransactionQueries";
import {useTransactionServices} from "./TransactionServicesProvider";

export const getCreateTransactionMutationKey = () => ["createTransaction"] as const;

export const useCreateTransaction = () => {
  const {transactionsService} = useTransactionServices();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getCreateTransactionMutationKey(),
    mutationFn: (tx: Omit<Transaction, "id">) => transactionsService.create(tx),
    onSuccess: () => {
      invalidateTransactionQueries(queryClient);
    },
  });
};
