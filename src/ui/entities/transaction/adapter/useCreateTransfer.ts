import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {TransferPayload} from "@/core/transaction/service/ITransactionsService";
import {invalidateTransactionQueries} from "./invalidateTransactionQueries";
import {useTransactionServices} from "./TransactionServicesProvider";

export const getCreateTransferMutationKey = () => ["createTransfer"] as const;

export const useCreateTransfer = () => {
  const {transactionsService} = useTransactionServices();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getCreateTransferMutationKey(),
    mutationFn: (payload: TransferPayload) => transactionsService.createTransfer(payload),
    onSuccess: () => {
      invalidateTransactionQueries(queryClient);
    },
  });
};
