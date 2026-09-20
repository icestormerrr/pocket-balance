import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {TransferPayload} from "../service/ITransactionsService";
import {transactionsService} from "../service/TransactionsService";
import {invalidateTransactionQueries} from "./invalidateTransactionQueries";

export const getCreateTransferMutationKey = () => ["createTransfer"] as const;

export const useCreateTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getCreateTransferMutationKey(),
    mutationFn: (payload: TransferPayload) => transactionsService.createTransfer(payload),
    onSuccess: () => {
      invalidateTransactionQueries(queryClient);
    },
  });
};
