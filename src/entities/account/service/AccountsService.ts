import {DateConverter} from "@/shared/lib/datetime";
import type {Account} from "../model/Account";
import {AccountLocalStorageRepository} from "../repository/AccountLocalStorageRepository";
import type {IAccountsRepository} from "../repository/IAccountsRepository";
import type {AccountCreatePayload, AccountsFilter, AccountUpdatePayload, IAccountsService} from "./IAccountsService";

export class AccountsService implements IAccountsService {
  private readonly repository: IAccountsRepository;

  constructor(repository: IAccountsRepository) {
    this.repository = repository;
  }

  async getAll(filter: AccountsFilter): Promise<Account[]> {
    return this.repository.getAll(filter);
  }

  async getById(id: string): Promise<Account | null> {
    return this.repository.getById(id);
  }

  // TODO: дописать проверку на лишние поля
  validateAccount(data: unknown, allowPartial = false) {
    if (typeof data !== "object" || data === null) {
      throw new Error("Некорректный счет");
    }
    const account = data as Partial<Account>;

    if ((!allowPartial || "name" in account) && (typeof account.name !== "string" || account.name.trim().length === 0)) {
      throw new Error("Название счета не может быть пустым");
    }

    if ((!allowPartial || "startAmount" in account) && (typeof account.startAmount !== "number" || !Number.isFinite(account.startAmount) || account.startAmount < 0)) {
      throw new Error("Начальная сумма не может быть пустой");
    }

    if ((!allowPartial || "currencyCode" in account) && (typeof account.currencyCode !== "string" || account.currencyCode.trim().length === 0)) {
      throw new Error("Валюта не может быть пустой");
    }
  }

  async create(category: AccountCreatePayload): Promise<Account> {
    this.validateAccount(category);
    return this.repository.create({
      ...category,
      creationDatetime: DateConverter.dateToISO(new Date()),
    });
  }

  async update(id: string, category: AccountUpdatePayload): Promise<Account | null> {
    this.validateAccount(category, true);
    return this.repository.update(id, category);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}

export const accountsService = new AccountsService(new AccountLocalStorageRepository());
