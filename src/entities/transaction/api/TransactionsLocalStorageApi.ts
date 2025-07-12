import type {Transaction} from "../model/Transaction.ts";
import type {ITransactionsApi} from "./ITransactionsApi.ts";

const STORAGE_KEY = "transactions";

function load(): Transaction[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function save(transactions: Transaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export class TransactionsLocalStorageApi implements ITransactionsApi {
  async getAll(filter: {startDate?: string; endDate?: string}): Promise<Transaction[]> {
    const raw = load();

    return raw.filter(tx => {
      const date = new Date(tx.date);

      let isBetweenDates = true;
      if (filter.startDate) {
        isBetweenDates &&= date >= new Date(filter.startDate);
      }
      if (filter.endDate) {
        isBetweenDates &&= date <= new Date(filter.endDate);
      }

      return isBetweenDates;
    });
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
