import {beforeEach, describe, expect, it, jest} from "@jest/globals";

import type {Category, CategoryType} from "@/entities/category";
import type {ICategoriesService} from "@/entities/category/service/ICategoriesService";

import type {Transaction} from "../../model/Transaction";
import type {ITransactionsRepository} from "../../repository/ITransactionsRepository";
import {TransactionsService} from "../TransactionsService";

const mockRepo: jest.Mocked<ITransactionsRepository> = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockCategoriesService: jest.Mocked<ICategoriesService> = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const makeService = () => new TransactionsService(mockRepo, mockCategoriesService);

const mockTransactions: Transaction[] = [
  {
    id: "1",
    amount: 100,
    categoryId: "c1",
    date: "2024-01-01",
  },
  {
    id: "2",
    amount: 200,
    categoryId: "c2",
    date: "2023-12-01",
  },
];

const mockCategories: Category[] = [
  {id: "c1", name: "Food", type: "expense" as CategoryType, color: "#f00", creationDatetime: ""},
  {id: "c2", name: "Salary", type: "income" as CategoryType, color: "#ff0", creationDatetime: ""},
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe("TransactionsService", () => {
  it("getAll returns transactions with categoryName and type, and filters by type", async () => {
    mockRepo.getAll.mockResolvedValue(mockTransactions);
    mockCategoriesService.getAll.mockResolvedValue(mockCategories);

    const service = makeService();
    const result = await service.getAll({categoryType: "expense"});

    expect(result).toHaveLength(1);
    expect(result[0].categoryName).toBe("Food");
    expect(result[0].categoryType).toBe("expense");
  });

  it("getById returns transaction", async () => {
    mockRepo.getById.mockResolvedValue(mockTransactions[0]);
    mockCategoriesService.getById.mockResolvedValue(mockCategories[0]);

    const service = makeService();
    const result = await service.getById("1");

    expect(result).toEqual({
      ...mockTransactions[0],
      categoryName: mockCategories[0].name,
      categoryType: mockCategories[0].type,
    });
  });

  it("getUniqYears returns unique years", async () => {
    mockRepo.getAll.mockResolvedValue(mockTransactions);
    const service = makeService();
    const years = await service.getUniqYears();
    expect(years).toEqual([2024, 2023]);
  });

  it("getSummary calculates total income and expense", async () => {
    mockRepo.getAll.mockResolvedValue(mockTransactions);
    mockCategoriesService.getAll.mockResolvedValue(mockCategories);

    const service = makeService();
    const result = await service.getSummary();

    expect(result).toEqual({income: 200, expense: 100});
  });

  it("getCategoriesReport returns amounts grouped by categories", async () => {
    mockRepo.getAll.mockResolvedValue(mockTransactions);
    mockCategoriesService.getAll.mockResolvedValue(mockCategories);

    const service = makeService();
    const result = await service.getCategoriesReport();

    expect(result).toEqual([
      {
        categoryId: "c1",
        categoryName: "Food",
        amount: 100,
        categoryColor: "#f00",
      },
      {
        categoryId: "c2",
        categoryName: "Salary",
        amount: 200,
        categoryColor: "#ff0",
      },
    ]);
  });

  describe("getBalanceReport (cumulative)", () => {
    beforeEach(() => {
      mockRepo.getAll.mockResolvedValue(mockTransactions);
      mockCategoriesService.getAll.mockResolvedValue(mockCategories);
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
          balance: 200, // 200
        },
        {
          label: "2024",
          periodStart: "2024-01-01",
          income: 0,
          expense: 100,
          balance: 100, // 200 - 100 = 100
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

    it("throws on wrong granularity", async () => {
      const service = makeService();
      // @ts-ignore
      await expect(service.getBalanceReport({granularity: "week"})).rejects.toThrow(/granularity/);
    });
  });

  describe("validation", () => {
    const validTx = {
      amount: 100,
      categoryId: "c1",
      date: "2024-01-01",
    };

    it("create throws if amount invalid", async () => {
      const service = makeService();
      await expect(service.create({...validTx, amount: -5})).rejects.toThrow(/Сумма должна быть положительным числом/);
    });

    it("create throws if categoryId is missing", async () => {
      const service = makeService();
      await expect(service.create({...validTx, categoryId: ""})).rejects.toThrow(/Не указана категория/);
    });

    it("create throws if category not found", async () => {
      mockCategoriesService.getById.mockResolvedValue(null);
      const service = makeService();
      await expect(service.create(validTx)).rejects.toThrow(/Категория не найдена/);
    });

    it("create throws if date is invalid", async () => {
      mockCategoriesService.getById.mockResolvedValue(mockCategories[0]);
      const service = makeService();
      await expect(service.create({...validTx, date: "invalid"})).rejects.toThrow(/Дата должна быть в формате ISO/);
    });

    it("create works with valid data", async () => {
      mockCategoriesService.getById.mockResolvedValue(mockCategories[0]);
      mockRepo.create.mockResolvedValue({...validTx, id: "123"});

      const service = makeService();
      const result = await service.create(validTx);

      expect(result).toEqual({...validTx, id: "123"});
    });

    it("update calls repository after validation", async () => {
      mockCategoriesService.getById.mockResolvedValue(mockCategories[0]);
      mockRepo.update.mockResolvedValue({...validTx, id: "1"});

      const service = makeService();
      const result = await service.update("1", validTx);

      expect(result).toEqual({...validTx, id: "1"});
    });
  });

  it("delete calls repository", async () => {
    const service = makeService();
    await service.delete("1");
    expect(mockRepo.delete).toHaveBeenCalledWith("1");
  });
});
