import type {QueryClient} from "@tanstack/react-query";

export const invalidateTransactionQueries = (queryClient: QueryClient) => {
  void queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactions")});
  void queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transaction")});
  void queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsSummary")});
  void queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsYears")});
  void queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsCategoriesReport")});
  void queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsCashflowReport")});
  void queryClient.invalidateQueries({
    predicate: query => query.queryKey.includes("transactionsExpenseInsightsReport"),
  });
  void queryClient.invalidateQueries({
    predicate: query => query.queryKey.includes("transactionsPeriodComparisonReport"),
  });
  void queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transactionsAccountFlowReport")});
  void queryClient.invalidateQueries({predicate: query => query.queryKey.includes("transfer")});
};
