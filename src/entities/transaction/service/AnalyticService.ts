import {categoriesService} from "@/entities/category/service/CategoriesService";
import type {ICategoriesService} from "@/entities/category/service/ICategoriesService";
import dayjs from "dayjs";
import type {ITransactionsRepository} from "../repository/ITransactionsRepository";
import {TransactionsLocalStorageRepository} from "../repository/TransactionsLocalStorageRepository";
import type {
  BalanceByPeriod,
  IAnalyticService,
  ITransactionsService,
  TransactionsFilter,
  TransactionsGroupedByCategory,
  TransactionsSummary,
} from "./ITransactionsService";
import {transactionsService} from "./TransactionsService";

export class AnalyticService implements IAnalyticService {
  private readonly transactionService: Pick<ITransactionsService, "getAll">;
  private readonly transactionsRepository: ITransactionsRepository;
  private readonly categoriesService: ICategoriesService;

  constructor(
    transactionService: Pick<ITransactionsService, "getAll">,
    transactionsRepository: ITransactionsRepository,
    categoriesService: ICategoriesService
  ) {
    this.transactionService = transactionService;
    this.transactionsRepository = transactionsRepository;
    this.categoriesService = categoriesService;
  }

  async getUniqYears(): Promise<number[]> {
    const transactions = await this.transactionsRepository.getAll({});

    const years = transactions.map(d => new Date(d.date).getFullYear());

    return Array.from(new Set(years));
  }

  async getSummary(filter: TransactionsFilter): Promise<TransactionsSummary> {
    const transactions = await this.transactionService.getAll(filter);

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

  async getCategoriesReport(filter: TransactionsFilter = {}): Promise<TransactionsGroupedByCategory[]> {
    const transactions = await this.transactionService.getAll(filter);
    const categories = await this.categoriesService.getAll({});

    const amountsByCategories = transactions.reduce<Record<string, number>>((acc, tx) => {
      acc[tx.categoryId] = (acc[tx.categoryId] || 0) + Number(tx.amount);
      return acc;
    }, {});

    return Object.entries(amountsByCategories).map(([categoryId, amount]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        categoryId: category?.id ?? "",
        categoryName: category?.name ?? "����������� ���������",
        amount,
        categoryColor: category?.color,
        categoryShortName: category?.shortName,
      };
    });
  }

  async getBalanceReport(opts: {
    granularity: "year" | "month" | "day";
    startDate?: string;
    endDate?: string;
  }): Promise<BalanceByPeriod[]> {
    const {granularity, startDate, endDate} = opts;
    if (!["year", "month", "day"].includes(granularity)) {
      throw new Error('granularity must be "year" | "month" | "day"');
    }

    // ���� ������ ���������� � ��������� ���������
    const txs = await this.transactionService.getAll({startDate, endDate});

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

    // ��������� �� ������ ������� � ������� ����������� ����
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
          balance: running,
        };
      });

    return sorted;
  }
}

export const analyticService = new AnalyticService(
  transactionsService,
  new TransactionsLocalStorageRepository(),
  categoriesService
);
