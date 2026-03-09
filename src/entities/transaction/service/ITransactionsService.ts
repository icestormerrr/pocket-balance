import type {CategoryType} from "@/entities/category/model/Category";

import type {Transaction} from "../model/Transaction";

export interface ITransactionsService {
  getAll(filter: TransactionsFilter): Promise<TransactionExtended[]>;
  getById(id: string): Promise<TransactionExtended | null>;
  create(tx: TransactionCreatePayload): Promise<Transaction>;
  update(id: string, tx: TransactionUpdatePayload): Promise<Transaction | null>;
  delete(id: string): Promise<void>;

  getTransferById(transferId: string): Promise<TransferExtended | null>;
  createTransfer(payload: TransferPayload): Promise<[Transaction, Transaction]>;
  updateTransfer(transferId: string, payload: TransferPayload): Promise<void>;
  deleteTransfer(transferId: string): Promise<void>;
}

export interface TransactionsFilter {
  startDate?: string;
  endDate?: string;
  categoryType?: CategoryType;
  categoryId?: string;
  accountId?: string;
  excludeTransfers?: boolean;
}

export interface TransactionExtended extends Transaction {
  categoryName: string;
  categoryType?: CategoryType;
  categoryShortName?: string;
  accountName?: string;
}

export type TransactionCreatePayload = Omit<Transaction, "id">;

export type TransactionUpdatePayload = Partial<Omit<Transaction, "id">>;

export type TransferPayload = {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  date: string;
};

export type TransferExtended = TransferPayload & {
  transferId: string;
};

