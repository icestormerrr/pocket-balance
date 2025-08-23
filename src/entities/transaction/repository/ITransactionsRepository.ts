import type {Transaction} from "../model/Transaction";

export interface ITransactionsRepository {
  getAll(filter: {startDate?: string; endDate?: string}): Promise<Transaction[]>;
  getById(id: string): Promise<Transaction | null>;
  create(transaction: Omit<Transaction, "id">): Promise<Transaction>;
  update(id: string, transaction: Partial<Omit<Transaction, "id">>): Promise<Transaction | null>;
  delete(id: string): Promise<void>;
}
