import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {TransferPayload} from "../service/ITransactionsService";
import {transactionsService} from "../service/TransactionsService";
import {invalidateTransactionQueries} from "./invalidateTransactionQueries";

export const getUpdateTransferMutationKey = () => ["updateTransfer"] as const;

export const useUpdateTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getUpdateTransferMutationKey(),
    mutationFn: ({transferId, payload}: {transferId: string; payload: TransferPayload}) =>
      transactionsService.updateTransfer(transferId, payload),
    onSuccess: () => {
      invalidateTransactionQueries(queryClient);
    },
  });
};
