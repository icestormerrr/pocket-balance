import {beforeEach, describe, expect, it, jest} from "@jest/globals";

import type {Category, CategoryType} from "@/entities/category";
import type {ICategoriesService} from "@/entities/category/service/ICategoriesService";
import type {TransactionExtended} from "../ITransactionsService";
import type {Transaction} from "../../model/Transaction";
import type {ITransactionsRepository} from "../../repository/ITransactionsRepository";
import {AnalyticService} from "../AnalyticService";
import type {ITransactionsService} from "../ITransactionsService";

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

const makeService = () =>
  new AnalyticService(mockTxService, mockRepo, mockCategoriesService);

const mockTransactions: TransactionExtended[] = [
  {
    id: "1",
    amount: 100,
    categoryId: "c1",
    accountId: "a1",
    date: "2024-01-01",
    categoryName: "Food",
    categoryType: "expense",
  },
  {
    id: "2",
    amount: 200,
    categoryId: "c2",
    accountId: "a2",
    date: "2023-12-01",
    categoryName: "Salary",
    categoryType: "income",
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
];

beforeEach(() => {
  jest.clearAllMocks();
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

    expect(result).toEqual({income: 200, expense: 100});
  });

  it("getCategoriesReport returns amounts grouped by categories", async () => {
    mockTxService.getAll.mockResolvedValue(mockTransactions);
    mockCategoriesService.getAll.mockResolvedValue(mockCategories);

    const service = makeService();
    const result = await service.getCategoriesReport({});

    expect(result).toEqual([
      {
        categoryId: "c1",
        categoryName: "Food",
        amount: 100,
        categoryColor: "#f00",
        categoryShortName: "Fo",
      },
      {
        categoryId: "c2",
        categoryName: "Salary",
        amount: 200,
        categoryColor: "#ff0",
        categoryShortName: "Sa",
      },
    ]);
  });

  describe("getBalanceReport (cumulative)", () => {
    beforeEach(() => {
      mockTxService.getAll.mockResolvedValue(mockTransactions);
    });

    it("year: balance is cumulative", async () => {
      const service = makeService();
      const report = await service.getBalanceReport({granularity: "year"});

      expect(report).toEqual([
        {
          label: "2023",
          periodStart: "2023-01-01",
          income: 200,
          expense: 0,
          balance: 200,
        },
        {
          label: "2024",
          periodStart: "2024-01-01",
          income: 0,
          expense: 100,
          balance: 100,
        },
      ]);
    });

    it("month: balance is cumulative", async () => {
      const service = makeService();
      const report = await service.getBalanceReport({granularity: "month"});

      expect(report).toEqual([
        {
          label: "2023-12",
          periodStart: "2023-12-01",
          income: 200,
          expense: 0,
          balance: 200,
        },
        {
          label: "2024-01",
          periodStart: "2024-01-01",
          income: 0,
          expense: 100,
          balance: 100,
        },
      ]);
    });

    it("day: balance is cumulative", async () => {
      const service = makeService();
      const report = await service.getBalanceReport({granularity: "day"});

      expect(report).toEqual([
        {
          label: "2023-12-01",
          periodStart: "2023-12-01",
          income: 200,
          expense: 0,
          balance: 200,
        },
        {
          label: "2024-01-01",
          periodStart: "2024-01-01",
          income: 0,
          expense: 100,
          balance: 100,
        },
      ]);
    });
  });
});


