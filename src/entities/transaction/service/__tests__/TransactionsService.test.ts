import {beforeEach, describe, expect, it, jest} from "@jest/globals";

import type {Category, CategoryType} from "@/entities/category";
import type {ICategoriesService} from "@/entities/category/service/ICategoriesService";

import type {Account} from "@/entities/account";
import type {IAccountsService} from "@/entities/account/service/IAccountsService";
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

const mockAccountService: jest.Mocked<IAccountsService> = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const makeService = () => new TransactionsService(mockRepo, mockCategoriesService, mockAccountService);

const mockTransactions: Transaction[] = [
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

const mockAccounts: Account[] = [
  {id: "a1", startAmount: 1000, name: "Счёт 1", currencyCode: "RUB", creationDatetime: ""},
  {id: "a2", startAmount: 2000, name: "Счёт 2", currencyCode: "KZT", creationDatetime: ""},
];

beforeEach(() => {
  jest.clearAllMocks();
  mockCategoriesService.getById.mockResolvedValue(mockCategories[0]);
  mockAccountService.getById.mockResolvedValue(mockAccounts[0]);
});

describe("TransactionsService", () => {
  it("getAll returns transactions with categoryName and type", async () => {
    mockRepo.getAll.mockResolvedValue(mockTransactions);
    mockCategoriesService.getAll.mockResolvedValue(mockCategories);

    const service = makeService();
    const result = await service.getAll({});

    expect(result).toHaveLength(2);
    expect(result[0].categoryName).toBe("Food");
    expect(result[0].categoryType).toBe("expense");
    expect(mockRepo.getAll).toHaveBeenCalledWith({
      startDate: undefined,
      endDate: undefined,
      accountId: undefined,
      categoryIds: undefined,
    });
  });

  it("getAll passes categoryType filter as categoryIds map", async () => {
    mockRepo.getAll.mockResolvedValue([mockTransactions[0]]);
    mockCategoriesService.getAll.mockResolvedValue([mockCategories[0]]);

    const service = makeService();
    const result = await service.getAll({categoryType: "expense"});

    expect(result).toHaveLength(1);
    expect(mockRepo.getAll).toHaveBeenCalledWith({
      startDate: undefined,
      endDate: undefined,
      accountId: undefined,
      categoryIds: new Map([["c1", true]]),
    });
  });

  it("getAll passes categoryId filter as categoryIds map", async () => {
    mockRepo.getAll.mockResolvedValue([mockTransactions[0]]);
    mockCategoriesService.getAll.mockResolvedValue(mockCategories);

    const service = makeService();
    await service.getAll({categoryId: "c1"});

    expect(mockRepo.getAll).toHaveBeenCalledWith({
      startDate: undefined,
      endDate: undefined,
      accountId: undefined,
      categoryIds: new Map([["c1", true]]),
    });
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

  describe("validation", () => {
    const validTx = {
      amount: 100,
      categoryId: "c1",
      accountId: "a1",
      date: "2024-01-01",
    };

    it("create throws if amount invalid", async () => {
      const service = makeService();
      await expect(service.create({...validTx, amount: -5})).rejects.toThrow();
    });

    it("create throws if categoryId is missing", async () => {
      const service = makeService();
      await expect(service.create({...validTx, categoryId: ""})).rejects.toThrow();
    });

    it("create throws if category not found", async () => {
      mockCategoriesService.getById.mockResolvedValue(null);
      const service = makeService();
      await expect(service.create(validTx)).rejects.toThrow();
    });

    it("create throws if accountId is missing", async () => {
      const service = makeService();
      await expect(service.create({...validTx, accountId: ""})).rejects.toThrow();
    });

    it("create throws if account not found", async () => {
      mockAccountService.getById.mockResolvedValue(null);
      const service = makeService();
      await expect(service.create(validTx)).rejects.toThrow();
    });

    it("create throws if date is invalid", async () => {
      mockAccountService.getById.mockResolvedValue(mockAccounts[0]);
      mockCategoriesService.getById.mockResolvedValue(mockCategories[0]);
      const service = makeService();
      await expect(service.create({...validTx, date: "invalid"})).rejects.toThrow();
    });

    it("create works with valid data", async () => {
      mockAccountService.getById.mockResolvedValue(mockAccounts[0]);
      mockCategoriesService.getById.mockResolvedValue(mockCategories[0]);
      mockRepo.create.mockResolvedValue({...validTx, id: "123"});

      const service = makeService();
      const result = await service.create(validTx);

      expect(result).toEqual({...validTx, id: "123"});
    });

    it("update calls repository after validation", async () => {
      mockCategoriesService.getById.mockResolvedValue(mockCategories[0]);
      mockAccountService.getById.mockResolvedValue(mockAccounts[0]);

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
