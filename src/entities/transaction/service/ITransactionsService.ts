import type {CategoryType} from "@/entities/category/model/Category";

import type {Transaction} from "../model/Transaction";

export interface ITransactionsService {
  getAll(filter: TransactionsFilter): Promise<TransactionExtended[]>;
  getById(id: string): Promise<TransactionExtended | null>;
  getCategoriesReport(filter: TransactionsFilter): Promise<TransactionsGroupedByCategory[]>;
  getBalanceReport(opts: {
    granularity: "year" | "month" | "day";
    startDate?: string;
    endDate?: string;
  }): Promise<BalanceByPeriod[]>;
  getSummary(filter: TransactionsSummaryFilter): Promise<TransactionsSummary>;
  getUniqYears(): Promise<number[]>;
  create(tx: TransactionCreatePayload): Promise<Transaction>;
  update(id: string, tx: TransactionUpdatePayload): Promise<Transaction | null>;
  delete(id: string): Promise<void>;
}

export interface TransactionsFilter {
  startDate?: string;
  endDate?: string;
  categoryType?: CategoryType;
  accountId?: string;
}

export interface TransactionExtended extends Transaction {
  categoryName: string;
  categoryType?: CategoryType;
  categoryShortName?: string;
  accountName?: string;
}

export interface TransactionsGroupedByCategory {
  categoryId: string;
  categoryName: string;
  categoryColor?: string;
  amount: number;
}

export interface BalanceByPeriod {
  label: string;
  periodStart: string;
  income: number;
  expense: number;
  balance: number;
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

export type TransactionCreatePayload = Omit<Transaction, "id">;

export type TransactionUpdatePayload = Partial<Omit<Transaction, "id">>;
