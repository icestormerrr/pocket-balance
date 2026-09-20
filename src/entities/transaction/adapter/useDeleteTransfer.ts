import {useMutation, useQueryClient} from "@tanstack/react-query";
import {transactionsService} from "../service/TransactionsService";
import {invalidateTransactionQueries} from "./invalidateTransactionQueries";

export const getDeleteTransferMutationKey = () => ["deleteTransfer"] as const;

export const useDeleteTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getDeleteTransferMutationKey(),
    mutationFn: (transferId: string) => transactionsService.deleteTransfer(transferId),
    onSuccess: () => {
      invalidateTransactionQueries(queryClient);
    },
  });
};
