import {categoriesService} from "@/entities/category/service/CategoriesService.ts";
import type {ICategoriesService} from "@/entities/category/service/ICategoriesService.ts";

import type {CategoryType} from "@/entities/category/model/Category.ts";
import type {ITransactionsApi} from "../api/ITransactionsApi.ts";
import {TransactionsLocalStorageApi} from "../api/TransactionsLocalStorageApi.ts";
import type {Transaction} from "../model/Transaction.ts";
import type {ITransactionsService} from "./ITransactionsService";

export class TransactionsService implements ITransactionsService {
  private readonly api: ITransactionsApi;
  private readonly categoriesService: ICategoriesService;

  constructor(api: ITransactionsApi, categoriesService: ICategoriesService) {
    this.api = api;
    this.categoriesService = categoriesService;
  }

  async getAll(filter: {
    startDate?: string;
    endDate?: string;
    categoryType?: CategoryType;
  }): Promise<(Transaction & {categoryName: string; categoryType: CategoryType})[]> {
    const [transactions, categories] = await Promise.all([
      this.api.getAll({startDate: filter.startDate, endDate: filter.endDate}),
      this.categoriesService.getAll({}),
    ]);

    const transactionsWithCategoryTypeAndName = transactions.map(t => {
      const category = categories.find(c => c.id === t.categoryId);
      return {
        ...t,
        categoryName: category?.name ?? "Неизвестная категория",
        categoryType: category?.type ?? "expense",
      };
    });

    return transactionsWithCategoryTypeAndName.filter(tx => {
      if (filter.categoryType) {
        return tx.categoryType === filter.categoryType;
      }
      return true;
    });
  }

  async getById(id: string): Promise<Transaction | null> {
    return this.api.getById(id);
  }

  async getUniqYears(): Promise<number[]> {
    const transactions = await this.api.getAll({});

    const years = transactions.map(d => new Date(d.date).getFullYear());

    return Array.from(new Set(years));
  }

  async getSummary(startDate?: string, endDate?: string): Promise<{income: number; expense: number}> {
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

  async getAmountGropedByCategories(
    filter: {
      startDate?: string;
      endDate?: string;
      categoryType?: CategoryType;
    } = {}
  ): Promise<
    {
      categoryId: string;
      categoryName: string;
      categoryColor?: string;
      amount: number;
    }[]
  > {
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

  async create(tx: Omit<Transaction, "id">): Promise<Transaction> {
    return this.api.create(tx);
  }

  async update(id: string, tx: Partial<Omit<Transaction, "id">>): Promise<Transaction | null> {
    return this.api.update(id, tx);
  }

  async delete(id: string): Promise<void> {
    return this.api.delete(id);
  }
}

export const transactionsService = new TransactionsService(new TransactionsLocalStorageApi(), categoriesService);
