import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {TransferPayload} from "@/core/transaction/service/ITransactionsService";
import {invalidateTransactionQueries} from "./invalidateTransactionQueries";
import {useTransactionServices} from "./TransactionServicesProvider";

export const getUpdateTransferMutationKey = () => ["updateTransfer"] as const;

export const useUpdateTransfer = () => {
  const {transactionsService} = useTransactionServices();
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
