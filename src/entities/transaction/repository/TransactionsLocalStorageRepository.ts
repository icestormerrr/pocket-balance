import {DateComparator, DateConverter} from "@/shared/lib/datetime";
import {type Transaction, TRANSFER_IN_CATEGORY_ID, TRANSFER_OUT_CATEGORY_ID} from "../model/Transaction";
import type {ITransactionsRepository, TransactionsRepositoryFilter, TransferPayload} from "./ITransactionsRepository";

const STORAGE_KEY = "transactions";

function load(): Transaction[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function save(transactions: Transaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export class TransactionsLocalStorageRepository implements ITransactionsRepository {
  // Возможный неочевидный эффект: сортирует по датам
  async getAll(filter: TransactionsRepositoryFilter): Promise<Transaction[]> {
    const raw = load();

    return raw
      .filter(tx => {
        if (filter.transferId && tx.transferId !== filter.transferId) {
          return false;
        }

        if (filter.accountId && tx.accountId !== filter.accountId) {
          return false;
        }

        if (filter.categoryIds && !filter.categoryIds.has(tx.categoryId)) {
          return false;
        }

        if (filter.withoutTransactions && !!tx.transferId) {
          return false;
        }

        const date = DateConverter.ISOToDate(tx.date);

        if (filter.startDate && filter.endDate) {
          return DateComparator.isBetweenOrEqual(
            date,
            DateConverter.ISOToDate(filter.startDate),
            DateConverter.ISOToDate(filter.endDate),
            "day"
          );
        }

        if (filter.startDate) {
          return DateComparator.isAfterOrEqual(date, DateConverter.ISOToDate(filter.startDate), "day");
        }

        if (filter.endDate) {
          return DateComparator.isBeforeOrEqual(date, DateConverter.ISOToDate(filter.endDate), "day");
        }

        return true;
      })
      .sort((date1, date2) => (DateComparator.isBefore(date1.date, date2.date) ? 1 : -1));
  }

  async getById(id: string): Promise<Transaction | null> {
    const transactions = load();
    return transactions.find(tx => tx.id === id) ?? null;
  }

  async create(transaction: Omit<Transaction, "id">): Promise<Transaction> {
    const transactions = load();
    const newTx: Transaction = {...transaction, id: crypto.randomUUID()};
    transactions.push(newTx);
    save(transactions);
    return newTx;
  }

  async update(id: string, partial: Partial<Omit<Transaction, "id">>): Promise<Transaction | null> {
    const transactions = load();
    const index = transactions.findIndex(tx => tx.id === id);
    if (index === -1) return null;

    const updated = {...transactions[index], ...partial};
    transactions[index] = updated;
    save(transactions);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const transactions = load().filter(tx => tx.id !== id);
    save(transactions);
  }

  async createTransfer(
    from: Omit<Transaction, "id">,
    to: Omit<Transaction, "id">
  ): Promise<[Transaction, Transaction]> {
    const transactions = load();

    const transferId = crypto.randomUUID();

    const fromTx: Transaction = {
      ...from,
      id: crypto.randomUUID(),
      transferId,
    };

    const toTx: Transaction = {
      ...to,
      id: crypto.randomUUID(),
      transferId,
    };

    transactions.push(fromTx);
    transactions.push(toTx);

    save(transactions);

    return [fromTx, toTx];
  }

  async deleteTransfer(transferId: string): Promise<void> {
    const transactions = load();

    const filtered = transactions.filter(tx => tx.transferId !== transferId);

    save(filtered);
  }

  async updateTransfer(transferId: string, payload: TransferPayload): Promise<void> {
    const transactions = load();

    const transferTxs = transactions.filter(tx => tx.transferId === transferId);

    if (transferTxs.length !== 2) {
      throw new Error("Transfer corrupted");
    }

    // удаляем старые
    const filtered = transactions.filter(tx => tx.transferId !== transferId);

    // создаём новые
    const newFromTx: Transaction = {
      id: crypto.randomUUID(),
      accountId: payload.fromAccountId,
      categoryId: TRANSFER_OUT_CATEGORY_ID,
      amount: payload.amount,
      date: payload.date,
      transferId,
    };

    const newToTx: Transaction = {
      id: crypto.randomUUID(),
      accountId: payload.toAccountId,
      categoryId: TRANSFER_IN_CATEGORY_ID,
      amount: payload.amount,
      date: payload.date,
      transferId,
    };

    filtered.push(newFromTx, newToTx);

    save(filtered);
  }
}

