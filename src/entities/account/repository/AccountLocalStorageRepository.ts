import type {Account} from "../model/Account";
import type {IAccountsRepository} from "./IAccountsRepository";

const STORAGE_KEY = "accounts";

function load(): Account[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function save(accounts: Account[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

export class AccountLocalStorageRepository implements IAccountsRepository {
  async getAll(): Promise<Account[]> {
    return load();
  }

  async getById(id: string): Promise<Account | null> {
    const accounts = load();
    return accounts.find(acc => acc.id === id) ?? null;
  }

  async create(account: Omit<Account, "id">): Promise<Account> {
    const accounts = load();
    const newAcc: Account = {...account, id: crypto.randomUUID()};
    accounts.push(newAcc);
    save(accounts);
    return newAcc;
  }

  async update(id: string, partial: Partial<Omit<Account, "id">>): Promise<Account | null> {
    const accounts = load();
    const index = accounts.findIndex(acc => acc.id === id);
    if (index === -1) return null;

    const updated = {...accounts[index], ...partial};
    accounts[index] = updated;
    save(accounts);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const accounts = load().filter(acc => acc.id !== id);
    save(accounts);
  }
}
