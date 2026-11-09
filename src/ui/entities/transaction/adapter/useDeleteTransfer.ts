import {useMutation, useQueryClient} from "@tanstack/react-query";
import {invalidateTransactionQueries} from "./invalidateTransactionQueries";
import {useTransactionServices} from "./TransactionServicesProvider";

export const getDeleteTransferMutationKey = () => ["deleteTransfer"] as const;

export const useDeleteTransfer = () => {
  const {transactionsService} = useTransactionServices();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getDeleteTransferMutationKey(),
    mutationFn: (transferId: string) => transactionsService.deleteTransfer(transferId),
    onSuccess: () => {
      invalidateTransactionQueries(queryClient);
    },
  });
};
