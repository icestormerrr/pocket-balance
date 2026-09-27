import {beforeEach, describe, expect, it, jest} from "@jest/globals";

import type {Account} from "@/entities/account";
import type {IAccountsService} from "@/entities/account/service/IAccountsService";
import type {Category, CategoryType} from "@/entities/category";
import type {ICategoriesService} from "@/entities/category/service/ICategoriesService";

import type {Transaction} from "../../model/Transaction";
import type {ITransactionsRepository} from "../../repository/ITransactionsRepository";
import {AnalyticService} from "../AnalyticService";
import type {ITransactionsService, TransactionExtended} from "../ITransactionsService";

type TransactionServiceMock = jest.Mocked<Pick<ITransactionsService, "getAll">>;
type CategoriesServiceMock = jest.Mocked<Pick<ICategoriesService, "getAll">>;
type AccountsServiceMock = jest.Mocked<Pick<IAccountsService, "getAll">>;
type RepositoryMock = jest.Mocked<ITransactionsRepository>;

const categories: Category[] = [
  {id: "food", name: "Food", type: "expense" as CategoryType, color: "#f00", creationDatetime: "", shortName: "Fo"},
  {id: "transport", name: "Transport", type: "expense" as CategoryType, color: "#0af", creationDatetime: "", shortName: "Tr"},
  {id: "salary", name: "Salary", type: "income" as CategoryType, color: "#ff0", creationDatetime: "", shortName: "Sa"},
];

const accounts: Account[] = [
  {id: "cash", name: "Cash", currencyCode: "RUB", startAmount: 0, creationDatetime: ""},
  {id: "card", name: "Card", currencyCode: "RUB", startAmount: 0, creationDatetime: ""},
];

const transaction = (overrides: Partial<TransactionExtended> = {}): TransactionExtended => ({
  id: "transaction", amount: 100, categoryId: "food", accountId: "cash", date: "2024-01-01T12:00:00+03:00",
  categoryName: "Food", categoryType: "expense", ...overrides,
});

const createRepositoryMock = (): RepositoryMock => ({
  getAll: jest.fn(), getById: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn(),
  createTransfer: jest.fn(), deleteTransfer: jest.fn(), updateTransfer: jest.fn(),
});

const createDependencies = () => {
  const transactionService: TransactionServiceMock = {getAll: jest.fn<ITransactionsService["getAll"]>()};
  const repository = createRepositoryMock();
  const categoriesService: CategoriesServiceMock = {getAll: jest.fn<ICategoriesService["getAll"]>().mockResolvedValue(categories)};
  const accountsService: AccountsServiceMock = {getAll: jest.fn<IAccountsService["getAll"]>().mockResolvedValue(accounts)};

  return {
    transactionService, repository, categoriesService, accountsService,
    service: new AnalyticService(transactionService, repository, categoriesService as unknown as ICategoriesService, accountsService),
  };
};

describe("AnalyticService", () => {
  let dependencies: ReturnType<typeof createDependencies>;

  beforeEach(() => { dependencies = createDependencies(); });

  it("returns unique transaction years in repository order", async () => {
    const transactions: Transaction[] = [
      {id: "1", amount: 1, categoryId: "food", accountId: "cash", date: "2024-01-01"},
      {id: "2", amount: 1, categoryId: "food", accountId: "cash", date: "2023-01-01"},
      {id: "3", amount: 1, categoryId: "food", accountId: "cash", date: "2024-12-31"},
    ];
    dependencies.repository.getAll.mockResolvedValue(transactions);

    await expect(dependencies.service.getUniqYears()).resolves.toEqual([2024, 2023]);
    expect(dependencies.repository.getAll).toHaveBeenCalledWith({});
  });

  it("returns no years when the repository is empty", async () => {
    dependencies.repository.getAll.mockResolvedValue([]);
    await expect(dependencies.service.getUniqYears()).resolves.toEqual([]);
  });

  it("builds a summary and forwards its filter unchanged", async () => {
    dependencies.transactionService.getAll.mockResolvedValue([
      transaction({id: "income", amount: 300, categoryId: "salary", categoryType: "income"}),
      transaction({id: "expense", amount: 120}),
      transaction({id: "unknown", amount: 30, categoryType: undefined}),
    ]);
    const filter = {startDate: "2024-01-01", endDate: "2024-01-31", accountId: "cash"};

    await expect(dependencies.service.getSummary(filter)).resolves.toEqual({income: 300, expense: 120});
    expect(dependencies.transactionService.getAll).toHaveBeenCalledWith(filter);
  });

  it("groups categories, preserves unknown category ids and forwards its filter", async () => {
    dependencies.transactionService.getAll.mockResolvedValue([
      transaction({id: "food-1", amount: 120}),
      transaction({id: "food-2", amount: 80}),
      transaction({id: "unknown", amount: 40, categoryId: "deleted", categoryName: "Deleted"}),
    ]);
    const filter = {categoryId: "food"};

    await expect(dependencies.service.getCategoriesReport(filter)).resolves.toEqual([
      {categoryId: "food", categoryName: "Food", categoryColor: "#f00", categoryShortName: "Fo", amount: 200},
      {categoryId: "deleted", categoryName: "Неизвестная категория", categoryColor: undefined, categoryShortName: undefined, amount: 40},
    ]);
    expect(dependencies.transactionService.getAll).toHaveBeenCalledWith(filter);
    expect(dependencies.categoriesService.getAll).toHaveBeenCalledWith({});
  });

  it("builds and sorts daily cashflow while excluding transfers", async () => {
    dependencies.transactionService.getAll.mockResolvedValue([
      transaction({id: "late-income", amount: 300, categoryId: "salary", categoryType: "income", date: "2024-01-03T12:00:00+03:00"}),
      transaction({id: "expense", amount: 120, date: "2024-01-01T12:00:00+03:00"}),
      transaction({id: "income", amount: 200, categoryId: "salary", categoryType: "income", date: "2024-01-01T18:00:00+03:00"}),
      transaction({id: "ignored", amount: 50, categoryType: undefined, date: "2024-01-01T20:00:00+03:00"}),
    ]);

    await expect(dependencies.service.getCashflowReport({granularity: "day", startDate: "2024-01-01", endDate: "2024-01-03", accountId: "cash"})).resolves.toEqual([
      {label: "01.01", periodStart: "2024-01-01", income: 200, expense: 120, net: 80},
      {label: "03.01", periodStart: "2024-01-03", income: 300, expense: 0, net: 300},
    ]);
    expect(dependencies.transactionService.getAll).toHaveBeenCalledWith({startDate: "2024-01-01", endDate: "2024-01-03", accountId: "cash", excludeTransfers: true});
  });

  it("builds monthly cashflow for an empty period", async () => {
    dependencies.transactionService.getAll.mockResolvedValue([]);
    await expect(dependencies.service.getCashflowReport({granularity: "month"})).resolves.toEqual([]);
  });

  it("groups transactions by month", async () => {
    dependencies.transactionService.getAll.mockResolvedValue([
      transaction({id: "income", amount: 300, categoryId: "salary", categoryType: "income", date: "2024-01-15T12:00:00+03:00"}),
      transaction({id: "expense", amount: 120, date: "2024-01-20T12:00:00+03:00"}),
    ]);

    await expect(dependencies.service.getCashflowReport({granularity: "month"})).resolves.toEqual([
      {label: "01.2024", periodStart: "2024-01-01", income: 300, expense: 120, net: 180},
    ]);
  });

  it("builds sorted expense insights and overrides a supplied category type", async () => {
    dependencies.transactionService.getAll.mockResolvedValue([
      transaction({id: "transport", amount: 40, categoryId: "transport", categoryName: "Transport"}),
      transaction({id: "food-1", amount: 120}),
      transaction({id: "food-2", amount: 80}),
    ]);

    await expect(dependencies.service.getExpenseInsightsReport({categoryType: "income", accountId: "cash"})).resolves.toEqual([
      {categoryId: "food", categoryName: "Food", categoryColor: "#f00", categoryShortName: "Fo", amount: 200, share: 200 / 240, transactionsCount: 2, averageAmount: 100},
      {categoryId: "transport", categoryName: "Transport", categoryColor: "#0af", categoryShortName: "Tr", amount: 40, share: 40 / 240, transactionsCount: 1, averageAmount: 40},
    ]);
    expect(dependencies.transactionService.getAll).toHaveBeenCalledWith({categoryType: "expense", accountId: "cash", excludeTransfers: true});
  });

  it("uses zero share for a zero-amount expense", async () => {
    dependencies.transactionService.getAll.mockResolvedValue([transaction({amount: 0})]);
    await expect(dependencies.service.getExpenseInsightsReport({})).resolves.toMatchObject([{amount: 0, share: 0, transactionsCount: 1, averageAmount: 0}]);
  });

  it("retains an expense from a deleted category", async () => {
    dependencies.transactionService.getAll.mockResolvedValue([transaction({categoryId: "deleted", categoryName: "Deleted"})]);

    await expect(dependencies.service.getExpenseInsightsReport({})).resolves.toEqual([
      {categoryId: "deleted", categoryName: "Неизвестная категория", categoryColor: undefined, categoryShortName: undefined, amount: 100, share: 1, transactionsCount: 1, averageAmount: 100},
    ]);
  });

  it("compares equal-length periods, including deltas and category growth and reduction", async () => {
    const current = [
      transaction({id: "current-income", amount: 200, categoryId: "salary", categoryType: "income", date: "2024-01-10T12:00:00+03:00"}),
      transaction({id: "current-food", amount: 200, date: "2024-01-10T12:00:00+03:00"}),
      transaction({id: "current-transport", amount: 10, categoryId: "transport", date: "2024-01-11T12:00:00+03:00"}),
    ];
    const previous = [
      transaction({id: "previous-income", amount: 100, categoryId: "salary", categoryType: "income", date: "2024-01-08T12:00:00+03:00"}),
      transaction({id: "previous-food", amount: 100, date: "2024-01-08T12:00:00+03:00"}),
      transaction({id: "previous-transport", amount: 100, categoryId: "transport", date: "2024-01-09T12:00:00+03:00"}),
    ];
    dependencies.transactionService.getAll.mockResolvedValueOnce(current).mockResolvedValueOnce(previous);

    const report = await dependencies.service.getPeriodComparisonReport({startDate: "2024-01-10T00:00:00+03:00", endDate: "2024-01-11T23:59:59+03:00", accountId: "cash"});

    expect(dependencies.transactionService.getAll).toHaveBeenNthCalledWith(1, {startDate: "2024-01-10T00:00:00+03:00", endDate: "2024-01-11T23:59:59+03:00", accountId: "cash", excludeTransfers: true});
    expect(dependencies.transactionService.getAll).toHaveBeenNthCalledWith(2, {startDate: "2024-01-08T00:00:00+03:00", endDate: "2024-01-09T23:59:59+03:00", accountId: "cash", excludeTransfers: true});
    expect(report).toEqual({
      current: {income: 200, expense: 210, net: -10}, previous: {income: 100, expense: 200, net: -100},
      delta: {income: 100, expense: 10, net: 90}, deltaPercent: {income: 100, expense: 5, net: -90},
      topGrowthCategories: [{categoryId: "food", categoryName: "Food", categoryColor: "#f00", currentAmount: 200, previousAmount: 100, deltaAmount: 100, deltaPercent: 100}],
      topReductionCategories: [{categoryId: "transport", categoryName: "Transport", categoryColor: "#0af", currentAmount: 10, previousAmount: 100, deltaAmount: -90, deltaPercent: -90}],
    });
  });

  it("returns zero and null percentage deltas when a previous amount is zero", async () => {
    dependencies.transactionService.getAll.mockResolvedValueOnce([transaction({id: "income", amount: 10, categoryId: "salary", categoryType: "income"})]).mockResolvedValueOnce([]);

    const report = await dependencies.service.getPeriodComparisonReport({startDate: "2024-01-02", endDate: "2024-01-02"});

    expect(report.deltaPercent).toEqual({income: null, expense: 0, net: null});
    expect(report.topGrowthCategories).toEqual([]);
    expect(report.topReductionCategories).toEqual([]);
  });

  it("compares categories that exist in only one period, including deleted categories", async () => {
    dependencies.transactionService.getAll
      .mockResolvedValueOnce([
        transaction({id: "current-1", amount: 60, categoryId: "deleted", categoryName: "Deleted"}),
        transaction({id: "current-2", amount: 40, categoryId: "deleted", categoryName: "Deleted"}),
      ])
      .mockResolvedValueOnce([transaction({id: "previous", amount: 100, categoryId: "food"})]);

    const report = await dependencies.service.getPeriodComparisonReport({startDate: "2024-01-02", endDate: "2024-01-02"});

    expect(report.topGrowthCategories).toEqual([
      {categoryId: "deleted", categoryName: "Неизвестная категория", categoryColor: undefined, currentAmount: 100, previousAmount: 0, deltaAmount: 100, deltaPercent: null},
    ]);
    expect(report.topReductionCategories).toEqual([
      {categoryId: "food", categoryName: "Food", categoryColor: "#f00", currentAmount: 0, previousAmount: 100, deltaAmount: -100, deltaPercent: -100},
    ]);
  });

  it("groups account flow, sorts by expenses and falls back for an unknown account", async () => {
    dependencies.transactionService.getAll.mockResolvedValue([
      transaction({id: "cash-income", amount: 300, categoryId: "salary", categoryType: "income", accountId: "cash"}),
      transaction({id: "cash-expense", amount: 120, accountId: "cash"}),
      transaction({id: "unknown-expense", amount: 200, accountId: "deleted-account"}),
    ]);

    await expect(dependencies.service.getAccountFlowReport({startDate: "2024-01-01", endDate: "2024-01-31"})).resolves.toEqual([
      {accountId: "deleted-account", accountName: "Неизвестный счёт", income: 0, expense: 200, net: -200},
      {accountId: "cash", accountName: "Cash", income: 300, expense: 120, net: 180},
    ]);
    expect(dependencies.transactionService.getAll).toHaveBeenCalledWith({startDate: "2024-01-01", endDate: "2024-01-31", excludeTransfers: true});
    expect(dependencies.accountsService.getAll).toHaveBeenCalledWith({});
  });
});
