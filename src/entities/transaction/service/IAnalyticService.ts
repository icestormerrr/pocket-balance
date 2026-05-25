import type {TransactionsFilter} from "./ITransactionsService";

export interface IAnalyticService {
  getCategoriesReport(filter: TransactionsFilter): Promise<TransactionsGroupedByCategory[]>;
  getCashflowReport(opts: {
    granularity: "month" | "day";
    startDate?: string;
    endDate?: string;
    accountId?: string;
  }): Promise<CashflowPoint[]>;
  getExpenseInsightsReport(filter: TransactionsSummaryFilter): Promise<ExpenseInsightItem[]>;
  getPeriodComparisonReport(filter: RequiredPeriodComparisonFilter): Promise<PeriodComparisonReport>;
  getAccountFlowReport(filter: {startDate?: string; endDate?: string}): Promise<AccountFlowItem[]>;
  getSummary(filter: TransactionsSummaryFilter): Promise<TransactionsSummary>;
  getUniqYears(): Promise<number[]>;
}

export interface TransactionsSummaryFilter {
  startDate?: string;
  endDate?: string;
  accountId?: string;
}

export interface RequiredPeriodComparisonFilter extends TransactionsSummaryFilter {
  startDate: string;
  endDate: string;
}

export interface TransactionsSummary {
  income: number;
  expense: number;
}

export interface TransactionsGroupedByCategory {
  categoryId: string;
  categoryName: string;
  categoryColor?: string;
  categoryShortName?: string;
  amount: number;
}

export interface CashflowPoint {
  label: string;
  periodStart: string;
  income: number;
  expense: number;
  net: number;
}

export interface ExpenseInsightItem {
  categoryId: string;
  categoryName: string;
  categoryColor?: string;
  categoryShortName?: string;
  amount: number;
  share: number;
  transactionsCount: number;
  averageAmount: number;
}

export interface ComparisonTotals {
  income: number;
  expense: number;
  net: number;
}

export interface ComparisonDelta {
  income: number;
  expense: number;
  net: number;
}

export interface ComparisonDeltaPercent {
  income: number | null;
  expense: number | null;
  net: number | null;
}

export interface CategoryDeltaItem {
  categoryId: string;
  categoryName: string;
  categoryColor?: string;
  currentAmount: number;
  previousAmount: number;
  deltaAmount: number;
  deltaPercent: number | null;
}

export interface PeriodComparisonReport {
  current: ComparisonTotals;
  previous: ComparisonTotals;
  delta: ComparisonDelta;
  deltaPercent: ComparisonDeltaPercent;
  topGrowthCategories: CategoryDeltaItem[];
  topReductionCategories: CategoryDeltaItem[];
}

export interface AccountFlowItem {
  accountId: string;
  accountName: string;
  income: number;
  expense: number;
  net: number;
}
