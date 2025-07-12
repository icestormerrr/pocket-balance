import type {CategoryType} from "@/entities/category/model/Category.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {Transaction} from "../model/Transaction.ts";
import {transactionsService} from "../service/TransactionsService.ts";

export const useTransactions = (filter: {startDate?: string; endDate?: string; categoryType?: CategoryType}) => {
  return useQuery({
    queryKey: ["transactions", filter.startDate, filter.endDate, filter.categoryType],
    queryFn: () => transactionsService.getAll(filter),
  });
};

export const useTransaction = (id?: string) => {
  return useQuery({
    queryKey: ["transactions", id],
    queryFn: () => transactionsService.getById(id!),
    enabled: !!id,
  });
};

export const useTransactionsSummary = ({startDate, endDate}: {startDate?: string; endDate?: string}) => {
  return useQuery({
    queryKey: ["transactionsSummary", startDate, endDate],
    queryFn: () => transactionsService.getSummary(startDate, endDate),
  });
};

export const useAmountGroupedByCategory = ({
  startDate,
  endDate,
}: {
  startDate?: string;
  endDate?: string;
  categoryType?: CategoryType;
}) => {
  return useQuery({
    queryKey: ["transactionsAmount", startDate, endDate],
    queryFn: () => transactionsService.getAmountGropedByCategories({startDate, endDate}),
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
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsSummary")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsYears")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsAmount")});
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, tx}: {id: string; tx: Partial<Omit<Transaction, "id">>}) => transactionsService.update(id, tx),
    onSuccess: () => {
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactions")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsSummary")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsYears")});
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transactionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactions")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsSummary")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsYears")});
    },
  });
};
