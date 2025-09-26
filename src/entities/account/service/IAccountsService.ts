import type {Account} from "../model/Account";

export interface IAccountsService {
  getAll(filter: AccountsFilter): Promise<Account[]>;
  getById(id: string): Promise<Account | null>;
  create(acc: AccountCreatePayload): Promise<Account>;
  update(id: string, acc: AccountUpdatePayload): Promise<Account | null>;
  delete(id: string): Promise<void>;
}

export type AccountsFilter = object;

export type AccountCreatePayload = Omit<Account, "id" | "creationDatetime">;

export type AccountUpdatePayload = Partial<Omit<Account, "id">>;
