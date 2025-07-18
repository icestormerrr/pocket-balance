import type {CategoryType} from "@/entities/category/model/Category";

import type {Transaction} from "../model/Transaction";

export interface ITransactionsService {
  getAll(filter: TransactionsFilter): Promise<TransactionWithCategory[]>;
  getById(id: string): Promise<TransactionWithCategory | null>;
  getAmountGropedByCategories(filter: TransactionsFilter): Promise<TransactionsGroupedByCategory[]>;
  getSummary(startDate: string, endDate: string): Promise<TransactionsSummary>;
  getUniqYears(): Promise<number[]>;
  create(tx: TransactionCreatePayload): Promise<Transaction>;
  update(id: string, tx: TransactionUpdatePayload): Promise<Transaction | null>;
  delete(id: string): Promise<void>;
}

export interface TransactionsFilter {
  startDate?: string;
  endDate?: string;
  categoryType?: CategoryType;
}

export interface TransactionWithCategory extends Transaction {
  categoryName: string;
  categoryType?: CategoryType;
}

export interface TransactionsGroupedByCategory {
  categoryId: string;
  categoryName: string;
  categoryColor?: string;
  amount: number;
}

export interface TransactionsSummary {
  income: number;
  expense: number;
}

export type TransactionCreatePayload = Omit<Transaction, "id">;

export type TransactionUpdatePayload = Partial<Omit<Transaction, "id">>;
