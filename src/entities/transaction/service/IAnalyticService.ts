import type {TransactionsFilter} from "@/entities/transaction";

export interface IAnalyticService {
  getCategoriesReport(filter: TransactionsFilter): Promise<TransactionsGroupedByCategory[]>;
  getBalanceReport(opts: {
    granularity: "year" | "month" | "day";
    startDate?: string;
    endDate?: string;
  }): Promise<BalanceByPeriod[]>;
  getSummary(filter: TransactionsSummaryFilter): Promise<TransactionsSummary>;
  getUniqYears(): Promise<number[]>;
}
export interface TransactionsSummaryFilter {
  startDate?: string;
  endDate?: string;
  accountId?: string;
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

export interface BalanceByPeriod {
  label: string;
  periodStart: string;
  income: number;
  expense: number;
  balance: number;
}

