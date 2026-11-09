import {useQuery} from "@tanstack/react-query";
import {useTransactionServices} from "./TransactionServicesProvider";

export const getTransferQueryKey = (transferId?: string) => ["transfer", transferId] as const;

export const useTransfer = (transferId?: string) => {
  const {transactionsService} = useTransactionServices();
  return useQuery({
    queryKey: getTransferQueryKey(transferId),
    queryFn: () => transactionsService.getTransferById(transferId!),
    enabled: !!transferId,
  });
};
