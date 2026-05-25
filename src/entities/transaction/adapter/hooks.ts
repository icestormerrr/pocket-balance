import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import type {Transaction} from "../model/Transaction";
import {analyticService} from "../service/AnalyticService";
import type {RequiredPeriodComparisonFilter} from "../service/IAnalyticService";
import type {TransactionsFilter, TransferPayload} from "../service/ITransactionsService";
import {transactionsService} from "../service/TransactionsService";

const invalidateTransactionQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactions")});
  queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transaction")});
  queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsSummary")});
  queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsYears")});
  queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsCategoriesReport")});
  queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsCashflowReport")});
  queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsExpenseInsightsReport")});
  queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsPeriodComparisonReport")});
  queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsAccountFlowReport")});
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

export const useCashflowReport = ({
  startDate,
  endDate,
  accountId,
  granularity,
}: {
  startDate?: string;
  endDate?: string;
  accountId?: string;
  granularity: "month" | "day";
}) => {
  return useQuery({
    queryKey: ["transactionsCashflowReport", startDate, endDate, accountId, granularity],
    queryFn: () => analyticService.getCashflowReport({startDate, endDate, accountId, granularity}),
  });
};

export const useExpenseInsightsReport = (filter: TransactionsFilter) => {
  return useQuery({
    queryKey: ["transactionsExpenseInsightsReport", filter.startDate, filter.endDate, filter.accountId],
    queryFn: () => analyticService.getExpenseInsightsReport(filter),
  });
};

export const usePeriodComparisonReport = (filter: RequiredPeriodComparisonFilter) => {
  return useQuery({
    queryKey: ["transactionsPeriodComparisonReport", filter.startDate, filter.endDate, filter.accountId],
    queryFn: () => analyticService.getPeriodComparisonReport(filter),
    enabled: !!filter.startDate && !!filter.endDate,
  });
};

export const useAccountFlowReport = ({startDate, endDate}: {startDate?: string; endDate?: string}) => {
  return useQuery({
    queryKey: ["transactionsAccountFlowReport", startDate, endDate],
    queryFn: () => analyticService.getAccountFlowReport({startDate, endDate}),
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
