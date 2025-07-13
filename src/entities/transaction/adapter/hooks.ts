import type {CategoryType} from "@/entities/category/model/Category";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {Transaction} from "../model/Transaction";
import {transactionsService} from "../service/TransactionsService";

export const useTransactions = (filter: {startDate?: string; endDate?: string; categoryType?: CategoryType}) => {
  return useQuery({
    queryKey: ["transactions", filter.startDate, filter.endDate, filter.categoryType],
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

export const useTransactionsSummary = ({startDate, endDate}: {startDate?: string; endDate?: string}) => {
  return useQuery({
    queryKey: ["transactionsSummary", startDate, endDate],
    queryFn: () => transactionsService.getSummary(startDate, endDate),
  });
};

export const useAmountGroupedByCategory = ({
  startDate,
  endDate,
  categoryType,
}: {
  startDate?: string;
  endDate?: string;
  categoryType?: CategoryType;
}) => {
  return useQuery({
    queryKey: ["transactionsAmount", startDate, endDate, categoryType],
    queryFn: () => transactionsService.getAmountGropedByCategories({startDate, endDate, categoryType}),
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
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transaction")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsSummary")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsYears")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsAmount")});
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
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsAmount")});
    },
  });
};
