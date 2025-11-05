import {categoriesService} from "@/entities/category/service/CategoriesService";
import type {ICategoriesService} from "@/entities/category/service/ICategoriesService";

import {accountsService} from "@/entities/account/service/AccountsService";
import type {IAccountsService} from "@/entities/account/service/IAccountsService";
import dayjs from "dayjs";
import type {Transaction} from "../model/Transaction";
import type {ITransactionsRepository} from "../repository/ITransactionsRepository";
import {TransactionsLocalStorageRepository} from "../repository/TransactionsLocalStorageRepository";
import type {
  BalanceByPeriod,
  ITransactionsService,
  TransactionCreatePayload,
  TransactionExtended,
  TransactionsFilter,
  TransactionsGroupedByCategory,
  TransactionsSummary,
  TransactionsSummaryFilter,
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
    const [transactions, categories] = await Promise.all([
      this.repository.getAll({startDate: filter.startDate, endDate: filter.endDate}),
      this.categoriesService.getAll({}),
    ]);

    const transactionsExtended = transactions.map(t => {
      const category = categories.find(c => c.id === t.categoryId);

      return {
        ...t,
        categoryName: category?.name ?? "Неизвестная категория",
        categoryType: category?.type,
        categoryShortName: category?.shortName,
      };
    });

    return transactionsExtended.filter(tx => {
      let satisfies = true;
      if (filter.categoryType) {
        satisfies &&= tx.categoryType === filter.categoryType;
      }
      if (filter.accountId) {
        satisfies &&= tx.accountId === filter.accountId;
      }
      if (filter.categoryId) {
        satisfies &&= tx.categoryId === filter.categoryId;
      }
      return satisfies;
    });
  }

  async getById(id: string): Promise<TransactionExtended | null> {
    const tx = await this.repository.getById(id);

    if (!tx) return null;

    const category = await this.categoriesService.getById(tx.categoryId);

    return {...tx, categoryType: category?.type, categoryName: category?.name ?? "Неизвестная категория"};
  }

  async getUniqYears(): Promise<number[]> {
    const transactions = await this.repository.getAll({});

    const years = transactions.map(d => new Date(d.date).getFullYear());

    return Array.from(new Set(years));
  }

  // TODO: добавить поддержку счетов и валют
  async getSummary(filter: TransactionsSummaryFilter): Promise<TransactionsSummary> {
    const transactions = await this.getAll(filter);

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

  // TODO: добавить поддержку валют
  async getCategoriesReport(filter: TransactionsFilter = {}): Promise<TransactionsGroupedByCategory[]> {
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
        categoryShortName: category?.shortName,
      };
    });
  }

  // TODO: добавить поддержку счетов и валют
  // TODO: отрефакторить
  async getBalanceReport(opts: {
    granularity: "year" | "month" | "day";
    startDate?: string;
    endDate?: string;
  }): Promise<BalanceByPeriod[]> {
    const {granularity, startDate, endDate} = opts;
    if (!["year", "month", "day"].includes(granularity)) {
      throw new Error('granularity must be "year" | "month" | "day"');
    }

    // Берём только транзакции в указанном диапазоне
    const txs = await this.getAll({startDate, endDate});

    type Bucket = {income: number; expense: number; periodStart: string; label: string};
    const buckets = new Map<string, Bucket>();

    for (const tx of txs) {
      const d = dayjs(tx.date);

      let key: string;
      let label: string;
      let periodStart: string;

      if (granularity === "year") {
        key = d.format("YYYY");
        label = key;
        periodStart = d.startOf("year").format("YYYY-MM-DD");
      } else if (granularity === "month") {
        key = d.format("YYYY-MM");
        label = key;
        periodStart = d.startOf("month").format("YYYY-MM-DD");
      } else {
        key = d.format("YYYY-MM-DD");
        label = key;
        periodStart = d.startOf("day").format("YYYY-MM-DD");
      }

      const bucket = buckets.get(key) ?? {income: 0, expense: 0, periodStart, label};
      if (tx.categoryType === "income") bucket.income += tx.amount;
      else if (tx.categoryType === "expense") bucket.expense += tx.amount;
      buckets.set(key, bucket);
    }

    // сортируем по началу периода и считаем нарастающий итог
    let running = 0;
    const sorted = Array.from(buckets.values())
      .sort((a, b) => dayjs(a.periodStart).valueOf() - dayjs(b.periodStart).valueOf())
      .map(b => {
        running += b.income - b.expense;
        return {
          label: b.label,
          periodStart: b.periodStart,
          income: b.income,
          expense: b.expense,
          balance: running, // cumulative
        };
      });

    return sorted;
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
