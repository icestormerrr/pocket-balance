import TransactionsDateFilters, {type TransactionDateFilterType} from "@/entities/transaction/ui/TransactionsDateFilters";
import {
  useAccountFlowReport,
  useCashflowReport,
  useCategoriesReport,
  useCreateTransaction,
  useCreateTransfer,
  useDeleteTransaction,
  useDeleteTransfer,
  useExpenseInsightsReport,
  usePeriodComparisonReport,
  useTransaction,
  useTransactions,
  useTransactionsSummary,
  useTransactionsYears,
  useTransfer,
  useUpdateTransaction,
  useUpdateTransfer,
} from "./adapter/hooks";
import type {Transaction} from "./model/Transaction";
import type {
  AccountFlowItem,
  CashflowPoint,
  ExpenseInsightItem,
  PeriodComparisonReport,
  RequiredPeriodComparisonFilter,
  TransactionsGroupedByCategory,
  TransactionsSummary,
} from "./service/IAnalyticService";
import type {TransactionExtended, TransactionsFilter, TransferExtended} from "./service/ITransactionsService";
import {TransactionCard} from "./ui/TransactionCard/TransactionCard";

export {
  TransactionCard,
  TransactionsDateFilters,
  useAccountFlowReport,
  useCashflowReport,
  useCategoriesReport,
  useCreateTransaction,
  useCreateTransfer,
  useDeleteTransaction,
  useDeleteTransfer,
  useExpenseInsightsReport,
  usePeriodComparisonReport,
  useTransaction,
  useTransactions,
  useTransactionsSummary,
  useTransactionsYears,
  useTransfer,
  useUpdateTransaction,
  useUpdateTransfer,
};

export type {
  AccountFlowItem,
  CashflowPoint,
  ExpenseInsightItem,
  PeriodComparisonReport,
  RequiredPeriodComparisonFilter,
  Transaction,
  TransactionDateFilterType,
  TransactionExtended,
  TransactionsFilter,
  TransactionsGroupedByCategory,
  TransactionsSummary,
  TransferExtended,
};
