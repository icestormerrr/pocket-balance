import {useQuery} from "@tanstack/react-query";
import {transactionsService} from "../service/TransactionsService";

export const getTransferQueryKey = (transferId?: string) => ["transfer", transferId] as const;

export const useTransfer = (transferId?: string) => {
  return useQuery({
    queryKey: getTransferQueryKey(transferId),
    queryFn: () => transactionsService.getTransferById(transferId!),
    enabled: !!transferId,
  });
};
