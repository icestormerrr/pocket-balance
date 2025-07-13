import {DateComparator, DateConverter} from "@/shared/lib/datetime";
import type {Transaction} from "../model/Transaction";
import type {ITransactionsApi} from "./ITransactionsApi";

const STORAGE_KEY = "transactions";

function load(): Transaction[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function save(transactions: Transaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export class TransactionsLocalStorageApi implements ITransactionsApi {
  // возможный неожиданный эффект: сортирует по датам
  async getAll(filter: {startDate?: string; endDate?: string}): Promise<Transaction[]> {
    const raw = load();

    return raw
      .filter(tx => {
        const date = DateConverter.ISOToDate(tx.date);

        if (filter.startDate && filter.endDate) {
          // console.log(date, DateConverter.ISOToDate(filter.endDate));
          return DateComparator.isBetweenOrEqual(
            date,
            DateConverter.ISOToDate(filter.startDate),
            DateConverter.ISOToDate(filter.endDate),
            "day"
          );
        }

        if (filter.startDate) {
          return !DateComparator.isBeforeOrEqual(date, DateConverter.ISOToDate(filter.startDate), "day");
        }

        if (filter.endDate) {
          return !DateComparator.isBeforeOrEqual(date, DateConverter.ISOToDate(filter.endDate), "day");
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
}
