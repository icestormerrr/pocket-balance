import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import type {Transaction} from "../model/Transaction";
import {analyticService} from "../service/AnalyticService";
import type {TransactionsFilter, TransferPayload} from "../service/ITransactionsService";
import {transactionsService} from "../service/TransactionsService";

const invalidateTransactionQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactions")});
  queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transaction")});
  queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsSummary")});
  queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsYears")});
  queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsCategoriesReport")});
  queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsBalanceReport")});
  queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transfer")});
};

export const useTransactions = (filter: TransactionsFilter) => {
  return useQuery({
    queryKey: [
      "transactions",
      filter.startDate,
      filter.endDate,
      filter.categoryType,
      filter.accountId,
      filter.categoryId,
      filter.excludeTransfers,
    ],
    queryFn: () => transactionsService.getAll(filter),
  });
};

export const useTransaction = (id?: string) => {
  return useQuery({
    queryKey: ["transaction", id],
    queryFn: () => transactionsService.getById(id!),
    enabled: !!id,
  });
};

export const useTransfer = (transferId?: string) => {
  return useQuery({
    queryKey: ["transfer", transferId],
    queryFn: () => transactionsService.getTransferById(transferId!),
    enabled: !!transferId,
  });
};

export const useTransactionsSummary = (filter: TransactionsFilter) => {
  return useQuery({
    queryKey: [
      "transactionsSummary",
      filter.startDate,
      filter.endDate,
      filter.categoryType,
      filter.accountId,
      filter.categoryId,
      filter.excludeTransfers,
    ],
    queryFn: () => analyticService.getSummary(filter),
  });
};

export const useCategoriesReport = (filter: TransactionsFilter) => {
  return useQuery({
    queryKey: [
      "transactionsCategoriesReport",
      filter.startDate,
      filter.endDate,
      filter.categoryType,
      filter.accountId,
      filter.categoryId,
      filter.excludeTransfers,
    ],
    queryFn: () => analyticService.getCategoriesReport(filter),
    enabled: !!filter.categoryType,
  });
};

export const useBalanceReport = ({
  startDate,
  endDate,
  granularity,
}: {
  startDate?: string;
  endDate?: string;
  granularity: "year" | "month" | "day";
}) => {
  return useQuery({
    queryKey: ["transactionsBalanceReport", startDate, endDate, granularity],
    queryFn: () => analyticService.getBalanceReport({startDate, endDate, granularity}),
  });
};

export const useTransactionsYears = () => {
  return useQuery({
    queryKey: ["transactionsYears"],
    queryFn: () => analyticService.getUniqYears(),
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tx: Omit<Transaction, "id">) => transactionsService.create(tx),
    onSuccess: () => {
      invalidateTransactionQueries(queryClient);
    },
  });
};

export const useCreateTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TransferPayload) => transactionsService.createTransfer(payload),
    onSuccess: () => {
      invalidateTransactionQueries(queryClient);
    },
  });
};

export const useUpdateTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({transferId, payload}: {transferId: string; payload: TransferPayload}) =>
      transactionsService.updateTransfer(transferId, payload),
    onSuccess: () => {
      invalidateTransactionQueries(queryClient);
    },
  });
};

export const useDeleteTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transferId: string) => transactionsService.deleteTransfer(transferId),
    onSuccess: () => {
      invalidateTransactionQueries(queryClient);
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, tx}: {id: string; tx: Partial<Omit<Transaction, "id">>}) => transactionsService.update(id, tx),
    onSuccess: () => {
      invalidateTransactionQueries(queryClient);
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transactionsService.delete(id),
    onSuccess: () => {
      invalidateTransactionQueries(queryClient);
    },
  });
};

