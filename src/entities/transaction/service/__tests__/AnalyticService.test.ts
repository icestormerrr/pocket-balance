import {beforeEach, describe, expect, it, jest} from "@jest/globals";

import type {Account} from "@/entities/account";
import type {IAccountsService} from "@/entities/account/service/IAccountsService";
import type {Category, CategoryType} from "@/entities/category";
import type {ICategoriesService} from "@/entities/category/service/ICategoriesService";
import type {Transaction} from "../../model/Transaction";
import type {ITransactionsRepository} from "../../repository/ITransactionsRepository";
import type {TransactionExtended} from "../ITransactionsService";
import type {ITransactionsService} from "../ITransactionsService";
import {AnalyticService} from "../AnalyticService";

const mockTxService: jest.Mocked<Pick<ITransactionsService, "getAll">> = {
  getAll: jest.fn(),
};

const mockRepo: jest.Mocked<ITransactionsRepository> = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createTransfer: jest.fn(),
  deleteTransfer: jest.fn(),
  updateTransfer: jest.fn(),
};

const mockCategoriesService: jest.Mocked<ICategoriesService> = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockAccountsService: jest.Mocked<Pick<IAccountsService, "getAll">> = {
  getAll: jest.fn(),
};

const makeService = () => new AnalyticService(mockTxService, mockRepo, mockCategoriesService, mockAccountsService);

const mockTransactions: TransactionExtended[] = [
  {
    id: "1",
    amount: 120,
    categoryId: "c1",
    accountId: "a1",
    date: "2024-01-01T00:00:00+03:00",
    categoryName: "Food",
    categoryType: "expense",
  },
  {
    id: "2",
    amount: 80,
    categoryId: "c1",
    accountId: "a1",
    date: "2024-01-11T00:00:00+03:00",
    categoryName: "Food",
    categoryType: "expense",
  },
  {
    id: "3",
    amount: 200,
    categoryId: "c2",
    accountId: "a2",
    date: "2023-12-20T00:00:00+03:00",
    categoryName: "Salary",
    categoryType: "income",
  },
  {
    id: "4",
    amount: 300,
    categoryId: "c2",
    accountId: "a1",
    date: "2024-01-20T00:00:00+03:00",
    categoryName: "Salary",
    categoryType: "income",
  },
  {
    id: "5",
    amount: 40,
    categoryId: "c3",
    accountId: "a2",
    date: "2024-01-15T00:00:00+03:00",
    categoryName: "Transport",
    categoryType: "expense",
  },
];

const baseTransactions: Transaction[] = [
  {
    id: "1",
    amount: 100,
    categoryId: "c1",
    accountId: "a1",
    date: "2024-01-01",
  },
  {
    id: "2",
    amount: 200,
    categoryId: "c2",
    accountId: "a2",
    date: "2023-12-01",
  },
];

const mockCategories: Category[] = [
  {id: "c1", name: "Food", type: "expense" as CategoryType, color: "#f00", creationDatetime: "", shortName: "Fo"},
  {id: "c2", name: "Salary", type: "income" as CategoryType, color: "#ff0", creationDatetime: "", shortName: "Sa"},
  {
    id: "c3",
    name: "Transport",
    type: "expense" as CategoryType,
    color: "#0af",
    creationDatetime: "",
    shortName: "Tr",
  },
];

const mockAccounts: Account[] = [
  {id: "a1", name: "Основной", currencyCode: "RUB", startAmount: 0, creationDatetime: ""},
  {id: "a2", name: "Накопительный", currencyCode: "RUB", startAmount: 0, creationDatetime: ""},
];

beforeEach(() => {
  jest.clearAllMocks();
  mockCategoriesService.getAll.mockResolvedValue(mockCategories);
  mockAccountsService.getAll.mockResolvedValue(mockAccounts);
});

describe("AnalyticService", () => {
  it("getUniqYears returns unique years", async () => {
    mockRepo.getAll.mockResolvedValue(baseTransactions);
    const service = makeService();

    const years = await service.getUniqYears();

    expect(years).toEqual([2024, 2023]);
  });

  it("getSummary calculates total income and expense", async () => {
    mockTxService.getAll.mockResolvedValue(mockTransactions);
    const service = makeService();

    const result = await service.getSummary({});

    expect(result).toEqual({income: 500, expense: 240});
  });

  it("getCategoriesReport returns amounts grouped by categories", async () => {
    mockTxService.getAll.mockResolvedValue(mockTransactions);

    const service = makeService();
    const result = await service.getCategoriesReport({});

    expect(result).toEqual([
      {
        categoryId: "c1",
        categoryName: "Food",
        amount: 200,
        categoryColor: "#f00",
        categoryShortName: "Fo",
      },
      {
        categoryId: "c2",
        categoryName: "Salary",
        amount: 500,
        categoryColor: "#ff0",
        categoryShortName: "Sa",
      },
      {
        categoryId: "c3",
        categoryName: "Transport",
        amount: 40,
        categoryColor: "#0af",
        categoryShortName: "Tr",
      },
    ]);
  });

  it("getCashflowReport groups income and expense and calculates net", async () => {
    mockTxService.getAll.mockResolvedValue(mockTransactions);
    const service = makeService();

    const report = await service.getCashflowReport({granularity: "month"});

    expect(report).toEqual([
      {
        label: "12.2023",
        periodStart: "2023-12-01",
        income: 200,
        expense: 0,
        net: 200,
      },
      {
        label: "01.2024",
        periodStart: "2024-01-01",
        income: 300,
        expense: 240,
        net: 60,
      },
    ]);
  });

  it("getExpenseInsightsReport returns share, count and average", async () => {
    mockTxService.getAll.mockResolvedValue(mockTransactions.filter(tx => tx.categoryType === "expense"));
    const service = makeService();

    const report = await service.getExpenseInsightsReport({});

    expect(report).toEqual([
      {
        categoryId: "c1",
        categoryName: "Food",
        categoryColor: "#f00",
        categoryShortName: "Fo",
        amount: 200,
        share: 200 / 240,
        transactionsCount: 2,
        averageAmount: 100,
      },
      {
        categoryId: "c3",
        categoryName: "Transport",
        categoryColor: "#0af",
        categoryShortName: "Tr",
        amount: 40,
        share: 40 / 240,
        transactionsCount: 1,
        averageAmount: 40,
      },
    ]);
  });

  it("getPeriodComparisonReport compares with previous interval of the same length", async () => {
    mockTxService.getAll
      .mockResolvedValueOnce(
        mockTransactions.filter(tx => tx.date >= "2024-01-01" && tx.date <= "2024-01-31T23:59:59+03:00")
      )
      .mockResolvedValueOnce(mockTransactions.filter(tx => tx.date < "2024-01-01"));

    const service = makeService();
    const report = await service.getPeriodComparisonReport({
      startDate: "2024-01-01T00:00:00+03:00",
      endDate: "2024-01-31T23:59:59+03:00",
    });

    expect(report.current).toEqual({income: 300, expense: 240, net: 60});
    expect(report.previous).toEqual({income: 200, expense: 0, net: 200});
    expect(report.delta).toEqual({income: 100, expense: 240, net: -140});
    expect(report.topGrowthCategories[0]).toMatchObject({
      categoryId: "c1",
      currentAmount: 200,
      previousAmount: 0,
      deltaAmount: 200,
    });
  });

  it("getAccountFlowReport groups amounts by account", async () => {
    mockTxService.getAll.mockResolvedValue(mockTransactions);
    const service = makeService();

    const report = await service.getAccountFlowReport({});

    expect(report).toEqual([
      {
        accountId: "a1",
        accountName: "Основной",
        income: 300,
        expense: 200,
        net: 100,
      },
      {
        accountId: "a2",
        accountName: "Накопительный",
        income: 200,
        expense: 40,
        net: 160,
      },
    ]);
  });
});
