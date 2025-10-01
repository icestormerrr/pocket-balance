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

  // дописать проверку на лишние поля
  validateAccount(data: unknown) {
    if (typeof data !== "object" || data === null) {
      throw new Error("Некорректный счет");
    }

    if (!("name" in data) || typeof data.name !== "string" || data.name.trim().length === 0) {
      throw new Error("Название счета не может быть пустым");
    }

    if (!("startAmount" in data) || typeof data.startAmount !== "number" || data.startAmount < 0) {
      throw new Error("Начальная сумма не может быть пустой");
    }

    if (!("currencyCode" in data) || typeof data.currencyCode !== "string" || data.currencyCode.trim().length === 0) {
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
    this.validateAccount(category);
    return this.repository.update(id, category);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}

export const accountsService = new AccountsService(new AccountLocalStorageRepository());
