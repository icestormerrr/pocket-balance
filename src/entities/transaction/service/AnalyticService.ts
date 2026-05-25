import dayjs from "dayjs";

import {accountsService} from "@/entities/account/service/AccountsService";
import type {IAccountsService} from "@/entities/account/service/IAccountsService";
import {categoriesService} from "@/entities/category/service/CategoriesService";
import type {ICategoriesService} from "@/entities/category/service/ICategoriesService";
import {TransactionsLocalStorageRepository} from "../repository/TransactionsLocalStorageRepository";
import type {ITransactionsRepository} from "../repository/ITransactionsRepository";
import {transactionsService} from "./TransactionsService";
import type {ITransactionsService, TransactionsFilter, TransactionExtended} from "./ITransactionsService";
import type {
  AccountFlowItem,
  CashflowPoint,
  CategoryDeltaItem,
  ComparisonDeltaPercent,
  ExpenseInsightItem,
  IAnalyticService,
  PeriodComparisonReport,
  RequiredPeriodComparisonFilter,
  TransactionsGroupedByCategory,
  TransactionsSummary,
} from "./IAnalyticService";

export class AnalyticService implements IAnalyticService {
  private readonly transactionService: Pick<ITransactionsService, "getAll">;
  private readonly transactionsRepository: ITransactionsRepository;
  private readonly categoriesService: ICategoriesService;
  private readonly accountsService: Pick<IAccountsService, "getAll">;

  constructor(
    transactionService: Pick<ITransactionsService, "getAll">,
    transactionsRepository: ITransactionsRepository,
    categoriesService: ICategoriesService,
    accountsService: Pick<IAccountsService, "getAll">
  ) {
    this.transactionService = transactionService;
    this.transactionsRepository = transactionsRepository;
    this.categoriesService = categoriesService;
    this.accountsService = accountsService;
  }

  async getUniqYears(): Promise<number[]> {
    const transactions = await this.transactionsRepository.getAll({});
    const years = transactions.map(d => new Date(d.date).getFullYear());

    return Array.from(new Set(years));
  }

  async getSummary(filter: TransactionsFilter): Promise<TransactionsSummary> {
    const transactions = await this.transactionService.getAll(filter);

    return this.buildSummary(transactions);
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
        categoryName: category?.name ?? "Неизвестная категория",
        amount,
        categoryColor: category?.color,
        categoryShortName: category?.shortName,
      };
    });
  }

  async getCashflowReport(opts: {
    granularity: "month" | "day";
    startDate?: string;
    endDate?: string;
    accountId?: string;
  }): Promise<CashflowPoint[]> {
    const {granularity, startDate, endDate, accountId} = opts;
    const txs = await this.getReportTransactions({startDate, endDate, accountId});

    type Bucket = {income: number; expense: number; periodStart: string; label: string};
    const buckets = new Map<string, Bucket>();

    for (const tx of txs) {
      const d = dayjs(tx.date);
      const key = granularity === "month" ? d.format("YYYY-MM") : d.format("YYYY-MM-DD");
      const label = granularity === "month" ? d.format("MM.YYYY") : d.format("DD.MM");
      const periodStart = d.startOf(granularity).format("YYYY-MM-DD");
      const bucket = buckets.get(key) ?? {income: 0, expense: 0, periodStart, label};

      if (tx.categoryType === "income") bucket.income += tx.amount;
      if (tx.categoryType === "expense") bucket.expense += tx.amount;

      buckets.set(key, bucket);
    }

    return Array.from(buckets.values())
      .sort((a, b) => dayjs(a.periodStart).valueOf() - dayjs(b.periodStart).valueOf())
      .map(bucket => ({
        label: bucket.label,
        periodStart: bucket.periodStart,
        income: bucket.income,
        expense: bucket.expense,
        net: bucket.income - bucket.expense,
      }));
  }

  async getExpenseInsightsReport(filter: TransactionsFilter): Promise<ExpenseInsightItem[]> {
    const txs = await this.getReportTransactions({...filter, categoryType: "expense"});
    const categories = await this.categoriesService.getAll({});
    const categoriesMap = new Map(categories.map(category => [category.id, category]));
    const totalAmount = txs.reduce((sum, tx) => sum + tx.amount, 0);

    const grouped = txs.reduce<
      Map<
        string,
        {
          amount: number;
          transactionsCount: number;
        }
      >
    >((acc, tx) => {
      const current = acc.get(tx.categoryId) ?? {amount: 0, transactionsCount: 0};
      current.amount += tx.amount;
      current.transactionsCount += 1;
      acc.set(tx.categoryId, current);
      return acc;
    }, new Map());

    return Array.from(grouped.entries())
      .map(([categoryId, group]) => {
        const category = categoriesMap.get(categoryId);
        return {
          categoryId,
          categoryName: category?.name ?? "Неизвестная категория",
          categoryColor: category?.color,
          categoryShortName: category?.shortName,
          amount: group.amount,
          share: totalAmount > 0 ? group.amount / totalAmount : 0,
          transactionsCount: group.transactionsCount,
          averageAmount: group.transactionsCount > 0 ? group.amount / group.transactionsCount : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }

  async getPeriodComparisonReport(filter: RequiredPeriodComparisonFilter): Promise<PeriodComparisonReport> {
    const currentTransactions = await this.getReportTransactions({
      startDate: filter.startDate,
      endDate: filter.endDate,
      accountId: filter.accountId,
    });

    const start = dayjs(filter.startDate).startOf("day");
    const end = dayjs(filter.endDate).endOf("day");
    const daysInPeriod = end.startOf("day").diff(start.startOf("day"), "day") + 1;
    const previousEnd = start.subtract(1, "day").endOf("day");
    const previousStart = previousEnd.subtract(daysInPeriod - 1, "day").startOf("day");

    const previousTransactions = await this.getReportTransactions({
      startDate: previousStart.format("YYYY-MM-DDTHH:mm:ssZ"),
      endDate: previousEnd.format("YYYY-MM-DDTHH:mm:ssZ"),
      accountId: filter.accountId,
    });

    const current = this.buildSummary(currentTransactions);
    const previous = this.buildSummary(previousTransactions);
    const delta = {
      income: current.income - previous.income,
      expense: current.expense - previous.expense,
      net: current.income - current.expense - (previous.income - previous.expense),
    };
    const deltaPercent: ComparisonDeltaPercent = {
      income: this.calculatePercentDelta(previous.income, current.income),
      expense: this.calculatePercentDelta(previous.expense, current.expense),
      net: this.calculatePercentDelta(previous.income - previous.expense, current.income - current.expense),
    };

    const expenseDeltas = await this.buildExpenseDeltas(currentTransactions, previousTransactions);

    return {
      current: {...current, net: current.income - current.expense},
      previous: {...previous, net: previous.income - previous.expense},
      delta,
      deltaPercent,
      topGrowthCategories: expenseDeltas.filter(item => item.deltaAmount > 0).slice(0, 5),
      topReductionCategories: expenseDeltas
        .filter(item => item.deltaAmount < 0)
        .sort((a, b) => a.deltaAmount - b.deltaAmount)
        .slice(0, 5),
    };
  }

  async getAccountFlowReport(filter: {startDate?: string; endDate?: string}): Promise<AccountFlowItem[]> {
    const [transactions, accounts] = await Promise.all([
      this.getReportTransactions({startDate: filter.startDate, endDate: filter.endDate}),
      this.accountsService.getAll({}),
    ]);

    const accountsMap = new Map(accounts.map(account => [account.id, account]));
    const grouped = transactions.reduce<Map<string, AccountFlowItem>>((acc, tx) => {
      const current = acc.get(tx.accountId) ?? {
        accountId: tx.accountId,
        accountName: accountsMap.get(tx.accountId)?.name ?? "Неизвестный счёт",
        income: 0,
        expense: 0,
        net: 0,
      };

      if (tx.categoryType === "income") current.income += tx.amount;
      if (tx.categoryType === "expense") current.expense += tx.amount;
      current.net = current.income - current.expense;
      acc.set(tx.accountId, current);
      return acc;
    }, new Map());

    return Array.from(grouped.values()).sort((a, b) => Math.abs(b.expense) - Math.abs(a.expense));
  }

  private async buildExpenseDeltas(
    currentTransactions: TransactionExtended[],
    previousTransactions: TransactionExtended[]
  ): Promise<CategoryDeltaItem[]> {
    const categories = await this.categoriesService.getAll({});
    const categoriesMap = new Map(categories.map(category => [category.id, category]));
    const currentByCategory = this.groupAmountsByCategory(currentTransactions.filter(tx => tx.categoryType === "expense"));
    const previousByCategory = this.groupAmountsByCategory(previousTransactions.filter(tx => tx.categoryType === "expense"));
    const categoryIds = Array.from(new Set([...currentByCategory.keys(), ...previousByCategory.keys()]));

    return categoryIds
      .map(categoryId => {
        const currentAmount = currentByCategory.get(categoryId) ?? 0;
        const previousAmount = previousByCategory.get(categoryId) ?? 0;
        const deltaAmount = currentAmount - previousAmount;
        const category = categoriesMap.get(categoryId);

        return {
          categoryId,
          categoryName: category?.name ?? "Неизвестная категория",
          categoryColor: category?.color,
          currentAmount,
          previousAmount,
          deltaAmount,
          deltaPercent: this.calculatePercentDelta(previousAmount, currentAmount),
        };
      })
      .sort((a, b) => b.deltaAmount - a.deltaAmount);
  }

  private groupAmountsByCategory(transactions: TransactionExtended[]) {
    return transactions.reduce<Map<string, number>>((acc, tx) => {
      acc.set(tx.categoryId, (acc.get(tx.categoryId) ?? 0) + tx.amount);
      return acc;
    }, new Map());
  }

  private async getReportTransactions(filter: TransactionsFilter) {
    return this.transactionService.getAll({
      ...filter,
      excludeTransfers: true,
    });
  }

  private buildSummary(transactions: TransactionExtended[]): TransactionsSummary {
    return transactions.reduce(
      (acc, tx) => {
        if (tx.categoryType === "income") acc.income += tx.amount;
        if (tx.categoryType === "expense") acc.expense += tx.amount;
        return acc;
      },
      {income: 0, expense: 0}
    );
  }

  private calculatePercentDelta(previous: number, current: number) {
    if (previous === 0) {
      if (current === 0) return 0;
      return null;
    }

    return ((current - previous) / previous) * 100;
  }
}

export const analyticService = new AnalyticService(
  transactionsService,
  new TransactionsLocalStorageRepository(),
  categoriesService,
  accountsService
);
