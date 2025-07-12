import type {Transaction} from "../model/Transaction.ts";

export interface ITransactionsApi {
  getAll(filter: {startDate?: string; endDate?: string}): Promise<Transaction[]>;
  getById(id: string): Promise<Transaction | null>;
  create(transaction: Omit<Transaction, "id">): Promise<Transaction>;
  update(id: string, transaction: Partial<Omit<Transaction, "id">>): Promise<Transaction | null>;
  delete(id: string): Promise<void>;
}
