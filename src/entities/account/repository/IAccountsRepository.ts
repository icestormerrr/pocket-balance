import type {Account} from "../model/Account";

export interface IAccountsRepository {
  getAll(filter: object): Promise<Account[]>;
  getById(id: string): Promise<Account | null>;
  create(account: Omit<Account, "id">): Promise<Account>;
  update(id: string, account: Partial<Omit<Account, "id">>): Promise<Account | null>;
  delete(id: string): Promise<void>;
}
