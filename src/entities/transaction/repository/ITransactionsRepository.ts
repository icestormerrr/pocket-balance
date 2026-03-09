import type {Transaction} from "../model/Transaction";

export interface TransactionsRepositoryFilter {
  startDate?: string;
  endDate?: string;
  accountId?: string;
  categoryIds?: Map<string, boolean>;
  withoutTransactions?: boolean;
  transferId?: string;
}

export interface ITransactionsRepository {
  getAll(filter: TransactionsRepositoryFilter): Promise<Transaction[]>;
  getById(id: string): Promise<Transaction | null>;
  create(transaction: Omit<Transaction, "id">): Promise<Transaction>;
  update(id: string, transaction: Partial<Omit<Transaction, "id">>): Promise<Transaction | null>;
  delete(id: string): Promise<void>;

  createTransfer(from: Omit<Transaction, "id">, to: Omit<Transaction, "id">): Promise<[Transaction, Transaction]>;
  deleteTransfer(transferId: string): Promise<void>;
  updateTransfer(transferId: string, payload: TransferPayload): Promise<void>;
}

export type TransferPayload = {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  date: string;
};

