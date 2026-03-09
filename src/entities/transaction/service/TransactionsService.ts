import {categoriesService} from "@/entities/category/service/CategoriesService";
import type {ICategoriesService} from "@/entities/category/service/ICategoriesService";

import {accountsService} from "@/entities/account/service/AccountsService";
import type {IAccountsService} from "@/entities/account/service/IAccountsService";
import type {Transaction} from "../model/Transaction";
import type {ITransactionsRepository} from "../repository/ITransactionsRepository";
import {TransactionsLocalStorageRepository} from "../repository/TransactionsLocalStorageRepository";
import type {
  ITransactionsService,
  TransactionCreatePayload,
  TransactionExtended,
  TransactionsFilter,
  TransactionUpdatePayload,
} from "./ITransactionsService";

export class TransactionsService implements ITransactionsService {
  private readonly repository: ITransactionsRepository;
  private readonly categoriesService: ICategoriesService;
  private readonly accountService: IAccountsService;

  constructor(
    repository: ITransactionsRepository,
    categoriesService: ICategoriesService,
    accountsService: IAccountsService
  ) {
    this.repository = repository;
    this.categoriesService = categoriesService;
    this.accountService = accountsService;
  }

  async getAll(filter: TransactionsFilter): Promise<TransactionExtended[]> {
    const categories = await this.categoriesService.getAll({});

    const categoriesMap = new Map(categories.map(c => [c.id, c]));

    let categoryIds: string[] | undefined;

    if (filter.categoryType) {
      categoryIds = categories.filter(c => c.type === filter.categoryType).map(c => c.id);
    }

    if (filter.categoryId) {
      categoryIds = categoryIds ? categoryIds.filter(id => id === filter.categoryId) : [filter.categoryId];
    }

    if (categoryIds && categoryIds.length === 0) {
      return [];
    }

    const transactions = await this.repository.getAll({
      startDate: filter.startDate,
      endDate: filter.endDate,
      accountId: filter.accountId,
      categoryIds: categoryIds ? new Map(categoryIds.map(id => [id, true])) : undefined,
    });

    return transactions.map(tx => {
      const category = categoriesMap.get(tx.categoryId);

      return {
        ...tx,
        categoryName: category?.name ?? "Неизвестная категория",
        categoryType: category?.type,
        categoryShortName: category?.shortName,
      };
    });
  }

  async getById(id: string): Promise<TransactionExtended | null> {
    const tx = await this.repository.getById(id);

    if (!tx) return null;

    const category = await this.categoriesService.getById(tx.categoryId);

    return {...tx, categoryType: category?.type, categoryName: category?.name ?? "Неизвестная категория"};
  }

  // TODO: дописать проверку на лишние поля
  private async validateTransaction(tx: TransactionUpdatePayload): Promise<void> {
    const errors: string[] = [];

    if (tx.amount === undefined || typeof tx.amount !== "number" || tx.amount <= 0) {
      errors.push("Сумма должна быть положительным числом");
    }

    if (!tx.categoryId || typeof tx.categoryId !== "string") {
      errors.push("Не указана категория");
    } else {
      const category = await this.categoriesService.getById(tx.categoryId);
      if (!category) {
        errors.push("Категория не найдена");
      }
    }

    if (!tx.accountId || typeof tx.accountId !== "string") {
      errors.push("Не указан счёт");
    } else {
      const account = await this.accountService.getById(tx.accountId);
      if (!account) {
        errors.push("Счёт не найден");
      }
    }

    if (!tx.date || isNaN(Date.parse(tx.date))) {
      errors.push("Дата должна быть в формате ISO и быть валидной");
    }

    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }
  }

  async create(tx: TransactionCreatePayload): Promise<Transaction> {
    await this.validateTransaction(tx);
    return this.repository.create(tx);
  }

  async update(id: string, tx: TransactionUpdatePayload): Promise<Transaction | null> {
    await this.validateTransaction(tx);
    return this.repository.update(id, tx);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}

export const transactionsService = new TransactionsService(
  new TransactionsLocalStorageRepository(),
  categoriesService,
  accountsService
);
