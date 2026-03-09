import type {Transaction} from "../model/Transaction";

export interface TransactionsRepositoryFilter {
  startDate?: string;
  endDate?: string;
  accountId?: string;
  categoryIds?: Map<string, boolean>;
}

export interface ITransactionsRepository {
  getAll(filter: TransactionsRepositoryFilter): Promise<Transaction[]>;
  getById(id: string): Promise<Transaction | null>;
  create(transaction: Omit<Transaction, "id">): Promise<Transaction>;
  update(id: string, transaction: Partial<Omit<Transaction, "id">>): Promise<Transaction | null>;
  delete(id: string): Promise<void>;
}
