import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import type {Transaction} from "../model/Transaction";
import type {TransactionsFilter} from "../service/ITransactionsService";
import {transactionsService} from "../service/TransactionsService";

export const useTransactions = (filter: TransactionsFilter) => {
  return useQuery({
    queryKey: [
      "transactions",
      filter.startDate,
      filter.endDate,
      filter.categoryType,
      filter.accountId,
      filter.categoryId,
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

export const useTransactionsSummary = (filter: TransactionsFilter) => {
  return useQuery({
    queryKey: [
      "transactionsSummary",
      filter.startDate,
      filter.endDate,
      filter.categoryType,
      filter.accountId,
      filter.categoryId,
    ],
    queryFn: () => transactionsService.getSummary(filter),
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
    ],
    queryFn: () => transactionsService.getCategoriesReport(filter),
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
    queryFn: () => transactionsService.getBalanceReport({startDate, endDate, granularity}),
  });
};

export const useTransactionsYears = () => {
  return useQuery({
    queryKey: ["transactionsYears"],
    queryFn: () => transactionsService.getUniqYears(),
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tx: Omit<Transaction, "id">) => transactionsService.create(tx),
    onSuccess: () => {
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactions")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transaction")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsSummary")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsYears")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsCategoriesReport")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsBalanceReport")});
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, tx}: {id: string; tx: Partial<Omit<Transaction, "id">>}) => transactionsService.update(id, tx),
    onSuccess: () => {
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactions")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transaction")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsSummary")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsYears")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsCategoriesReport")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsBalanceReport")});
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transactionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactions")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transaction")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsSummary")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsYears")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsCategoriesReport")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsBalanceReport")});
    },
  });
};
