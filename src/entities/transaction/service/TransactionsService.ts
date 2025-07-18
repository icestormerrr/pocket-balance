import {categoriesService} from "@/entities/category/service/CategoriesService";
import type {ICategoriesService} from "@/entities/category/service/ICategoriesService";

import type {ITransactionsApi} from "../api/ITransactionsApi";
import {TransactionsLocalStorageApi} from "../api/TransactionsLocalStorageApi";
import type {Transaction} from "../model/Transaction";
import type {
  ITransactionsService,
  TransactionCreatePayload,
  TransactionsFilter,
  TransactionsGroupedByCategory,
  TransactionsSummary,
  TransactionUpdatePayload,
  TransactionWithCategory,
} from "./ITransactionsService";

export class TransactionsService implements ITransactionsService {
  private readonly api: ITransactionsApi;
  private readonly categoriesService: ICategoriesService;

  constructor(api: ITransactionsApi, categoriesService: ICategoriesService) {
    this.api = api;
    this.categoriesService = categoriesService;
  }

  async getAll(filter: TransactionsFilter): Promise<TransactionWithCategory[]> {
    const [transactions, categories] = await Promise.all([
      this.api.getAll({startDate: filter.startDate, endDate: filter.endDate}),
      this.categoriesService.getAll({}),
    ]);

    const transactionsWithCategoryTypeAndName = transactions.map(t => {
      const category = categories.find(c => c.id === t.categoryId);
      return {
        ...t,
        categoryName: category?.name ?? "Неизвестная категория",
        categoryType: category?.type,
      };
    });

    return transactionsWithCategoryTypeAndName.filter(tx => {
      if (filter.categoryType) {
        return tx.categoryType === filter.categoryType;
      }
      return true;
    });
  }

  async getById(id: string): Promise<TransactionWithCategory | null> {
    const tx = await this.api.getById(id);

    if (!tx) return null;

    const category = await this.categoriesService.getById(tx.categoryId);

    return {...tx, categoryType: category?.type, categoryName: category?.name ?? "Неизвестная категория"};
  }

  async getUniqYears(): Promise<number[]> {
    const transactions = await this.api.getAll({});

    const years = transactions.map(d => new Date(d.date).getFullYear());

    return Array.from(new Set(years));
  }

  async getSummary(startDate?: string, endDate?: string): Promise<TransactionsSummary> {
    const transactions = await this.getAll({startDate, endDate});

    const summary = transactions.reduce(
      (acc, tx) => {
        if (tx.categoryType === "income") {
          acc.income += tx.amount;
        } else if (tx.categoryType === "expense") {
          acc.expense += tx.amount;
        }
        return acc;
      },
      {income: 0, expense: 0}
    );

    return summary;
  }

  async getAmountGropedByCategories(filter: TransactionsFilter = {}): Promise<TransactionsGroupedByCategory[]> {
    const transactions = await this.getAll(filter);
    const categories = await this.categoriesService.getAll({});

    const amountsByCategories = transactions.reduce<Record<string, number>>((acc, tx) => {
      acc[tx.categoryId] = (acc[tx.categoryId] || 0) + Number(tx.amount);
      return acc;
    }, {});

    return Object.entries(amountsByCategories).map(([categoryId, amount]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        categoryId: category?.id ?? "",
        categoryName: category?.name ?? "Неизвестная категория",
        amount,
        categoryColor: category?.color,
      };
    });
  }

  // дописать проверку на лишние поля
  private async validateTransaction(tx: TransactionUpdatePayload): Promise<void> {
    const errors: string[] = [];

    if (tx.amount === undefined || typeof tx.amount !== "number" || tx.amount <= 0) {
      errors.push("Сумма должна быть положительным числом.");
    }

    if (!tx.categoryId || typeof tx.categoryId !== "string") {
      errors.push("Не указана категория.");
    } else {
      const category = await this.categoriesService.getById(tx.categoryId);
      if (!category) {
        errors.push("Категория не найдена.");
      }
    }

    if (!tx.date || isNaN(Date.parse(tx.date))) {
      errors.push("Дата должна быть в формате ISO и быть валидной.");
    }

    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }
  }

  async create(tx: TransactionCreatePayload): Promise<Transaction> {
    await this.validateTransaction(tx);
    return this.api.create(tx);
  }

  async update(id: string, tx: TransactionUpdatePayload): Promise<Transaction | null> {
    await this.validateTransaction(tx);
    return this.api.update(id, tx);
  }

  async delete(id: string): Promise<void> {
    return this.api.delete(id);
  }
}

export const transactionsService = new TransactionsService(new TransactionsLocalStorageApi(), categoriesService);
