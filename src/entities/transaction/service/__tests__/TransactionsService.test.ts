import {beforeEach, describe, expect, it, jest} from "@jest/globals";

import type {Category, CategoryType} from "@/entities/category";
import type {ICategoriesService} from "@/entities/category/service/ICategoriesService";

import type {ITransactionsApi} from "../../api/ITransactionsApi";
import type {Transaction} from "../../model/Transaction";
import {TransactionsService} from "../TransactionsService";

const mockApi: jest.Mocked<ITransactionsApi> = {
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

const makeService = () => new TransactionsService(mockApi, mockCategoriesService);

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
    mockApi.getAll.mockResolvedValue(mockTransactions);
    mockCategoriesService.getAll.mockResolvedValue(mockCategories);

    const service = makeService();
    const result = await service.getAll({categoryType: "expense"});

    expect(result).toHaveLength(1);
    expect(result[0].categoryName).toBe("Food");
    expect(result[0].categoryType).toBe("expense");
  });

  it("getById returns transaction", async () => {
    mockApi.getById.mockResolvedValue(mockTransactions[0]);
    const service = makeService();
    const result = await service.getById("1");
    expect(result).toEqual(mockTransactions[0]);
  });

  it("getUniqYears returns unique years", async () => {
    mockApi.getAll.mockResolvedValue(mockTransactions);
    const service = makeService();
    const years = await service.getUniqYears();
    expect(years).toEqual([2024, 2023]);
  });

  it("getSummary calculates total income and expense", async () => {
    mockApi.getAll.mockResolvedValue(mockTransactions);
    mockCategoriesService.getAll.mockResolvedValue(mockCategories);

    const service = makeService();
    const result = await service.getSummary();

    expect(result).toEqual({income: 200, expense: 100});
  });

  it("getAmountGropedByCategories returns grouped amounts", async () => {
    mockApi.getAll.mockResolvedValue(mockTransactions);
    mockCategoriesService.getAll.mockResolvedValue(mockCategories);

    const service = makeService();
    const result = await service.getAmountGropedByCategories();

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
      mockApi.create.mockResolvedValue({...validTx, id: "123"});

      const service = makeService();
      const result = await service.create(validTx);

      expect(result).toEqual({...validTx, id: "123"});
    });

    it("update calls api after validation", async () => {
      mockCategoriesService.getById.mockResolvedValue(mockCategories[0]);
      mockApi.update.mockResolvedValue({...validTx, id: "1"});

      const service = makeService();
      const result = await service.update("1", validTx);

      expect(result).toEqual({...validTx, id: "1"});
    });
  });

  it("delete calls api", async () => {
    const service = makeService();
    await service.delete("1");
    expect(mockApi.delete).toHaveBeenCalledWith("1");
  });
});
