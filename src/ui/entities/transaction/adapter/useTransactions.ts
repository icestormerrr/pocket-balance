import {useQuery} from "@tanstack/react-query";
import type {TransactionsFilter} from "@/core/transaction/service/ITransactionsService";
import {useTransactionServices} from "./TransactionServicesProvider";

export const getTransactionsQueryKey = (filter: TransactionsFilter) =>
  [
    "transactions",
    filter.startDate,
    filter.endDate,
    filter.categoryType,
    filter.accountId,
    filter.categoryId,
    filter.excludeTransfers,
  ] as const;

export const useTransactions = (filter: TransactionsFilter) => {
  const {transactionsService} = useTransactionServices();
  return useQuery({
    queryKey: getTransactionsQueryKey(filter),
    queryFn: () => transactionsService.getAll(filter),
  });
};
