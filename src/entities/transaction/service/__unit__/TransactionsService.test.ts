import {beforeEach, describe, expect, it, jest} from "@jest/globals";

import type {Account} from "@/entities/account";
import type {IAccountsService} from "@/entities/account/service/IAccountsService";
import type {Category, CategoryType} from "@/entities/category";
import type {ICategoriesService} from "@/entities/category/service/ICategoriesService";

import {TRANSFER_IN_CATEGORY_ID, TRANSFER_OUT_CATEGORY_ID, type Transaction} from "../../model/Transaction";
import type {ITransactionsRepository} from "../../repository/ITransactionsRepository";
import {TransactionsService} from "../TransactionsService";
import type {TransferPayload} from "../ITransactionsService";

type RepositoryMock = jest.Mocked<ITransactionsRepository>;
type CategoriesServiceMock = jest.Mocked<Pick<ICategoriesService, "getAll" | "getById">>;
type AccountsServiceMock = jest.Mocked<Pick<IAccountsService, "getById">>;

const categories: Category[] = [
  {id: "food", name: "Food", type: "expense" as CategoryType, color: "#f00", creationDatetime: "", shortName: "Fo"},
  {id: "salary", name: "Salary", type: "income" as CategoryType, color: "#ff0", creationDatetime: "", shortName: "Sa"},
];

const accounts: Account[] = [
  {id: "cash", startAmount: 1_000, name: "Cash", currencyCode: "RUB", creationDatetime: ""},
  {id: "card", startAmount: 2_000, name: "Card", currencyCode: "RUB", creationDatetime: ""},
];

const transactions: Transaction[] = [
  {id: "transaction-1", amount: 100, categoryId: "food", accountId: "cash", date: "2024-01-01"},
  {id: "transaction-2", amount: 200, categoryId: "salary", accountId: "card", date: "2024-01-02"},
];

const validTransaction = {amount: 100, categoryId: "food", accountId: "cash", date: "2024-01-01"};
const validTransfer: TransferPayload = {fromAccountId: "cash", toAccountId: "card", amount: 300, date: "2024-01-03"};

const createRepositoryMock = (): RepositoryMock => ({
  getAll: jest.fn(), getById: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn(),
  createTransfer: jest.fn(), deleteTransfer: jest.fn(), updateTransfer: jest.fn(),
});

const createDependencies = () => {
  const repository = createRepositoryMock();
  const categoriesService: CategoriesServiceMock = {
    getAll: jest.fn<ICategoriesService["getAll"]>().mockResolvedValue(categories),
    getById: jest.fn<ICategoriesService["getById"]>(categoryId => Promise.resolve(categories.find(category => category.id === categoryId) ?? null)),
  };
  const accountsService: AccountsServiceMock = {
    getById: jest.fn<IAccountsService["getById"]>(accountId => Promise.resolve(accounts.find(account => account.id === accountId) ?? null)),
  };

  return {
    repository, categoriesService, accountsService,
    service: new TransactionsService(repository, categoriesService as unknown as ICategoriesService, accountsService as unknown as IAccountsService),
  };
};

describe("TransactionsService", () => {
  let dependencies: ReturnType<typeof createDependencies>;

  beforeEach(() => { dependencies = createDependencies(); });

  describe("getAll", () => {
    it("enriches regular, transfer and unknown-category transactions and forwards all filters", async () => {
      const transfer: Transaction = {...transactions[0], id: "transaction-3", categoryId: TRANSFER_IN_CATEGORY_ID, accountId: "card", transferId: "transfer-1"};
      const outgoingTransfer: Transaction = {...transactions[0], id: "transaction-5", categoryId: TRANSFER_OUT_CATEGORY_ID, transferId: "transfer-1"};
      const unknownCategory = {...transactions[0], id: "transaction-4", categoryId: "removed-category"};
      dependencies.repository.getAll.mockResolvedValue([transactions[0], transfer, outgoingTransfer, unknownCategory]);

      const result = await dependencies.service.getAll({startDate: "2024-01-01", endDate: "2024-01-31", accountId: "cash", excludeTransfers: true});

      expect(dependencies.repository.getAll).toHaveBeenCalledWith({startDate: "2024-01-01", endDate: "2024-01-31", accountId: "cash", categoryIds: undefined, withoutTransactions: true});
      expect(result).toEqual([
        {...transactions[0], categoryName: "Food", categoryType: "expense", categoryShortName: "Fo"},
        {...transfer, categoryName: "Входящий перевод", categoryType: "income", categoryShortName: "💸"},
        {...outgoingTransfer, categoryName: "Исходящий перевод", categoryType: "expense", categoryShortName: "💸"},
        {...unknownCategory, categoryName: "Неизвестная категория", categoryType: undefined, categoryShortName: undefined},
      ]);
    });

    it("intersects category type and category id filters before querying the repository", async () => {
      dependencies.repository.getAll.mockResolvedValue([transactions[0]]);
      await dependencies.service.getAll({categoryType: "expense", categoryId: "food"});
      expect(dependencies.repository.getAll).toHaveBeenCalledWith({startDate: undefined, endDate: undefined, accountId: undefined, categoryIds: new Map([["food", true]]), withoutTransactions: undefined});
    });

    it("forwards a category id without a category type", async () => {
      dependencies.repository.getAll.mockResolvedValue([transactions[0]]);
      await dependencies.service.getAll({categoryId: "food"});
      expect(dependencies.repository.getAll).toHaveBeenCalledWith({startDate: undefined, endDate: undefined, accountId: undefined, categoryIds: new Map([["food", true]]), withoutTransactions: undefined});
    });

    it("returns an empty list without querying the repository when filters cannot match a category", async () => {
      await expect(dependencies.service.getAll({categoryType: "income", categoryId: "food"})).resolves.toEqual([]);
      expect(dependencies.repository.getAll).not.toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    it("returns null when the transaction does not exist", async () => {
      dependencies.repository.getById.mockResolvedValue(null);
      await expect(dependencies.service.getById("missing")).resolves.toBeNull();
      expect(dependencies.categoriesService.getById).not.toHaveBeenCalled();
    });

    it("enriches a regular transaction and falls back for a missing category", async () => {
      dependencies.repository.getById.mockResolvedValue({...transactions[0], categoryId: "removed-category"});
      await expect(dependencies.service.getById("transaction-1")).resolves.toEqual({...transactions[0], categoryId: "removed-category", categoryName: "Неизвестная категория", categoryType: undefined});
    });

    it("enriches a regular transaction with its category", async () => {
      dependencies.repository.getById.mockResolvedValue(transactions[0]);
      await expect(dependencies.service.getById("transaction-1")).resolves.toEqual({...transactions[0], categoryName: "Food", categoryType: "expense"});
    });

    it("enriches a transfer with its system category", async () => {
      const transfer: Transaction = {...transactions[0], categoryId: TRANSFER_OUT_CATEGORY_ID, transferId: "transfer-1"};
      dependencies.repository.getById.mockResolvedValue(transfer);
      await expect(dependencies.service.getById(transfer.id)).resolves.toEqual({...transfer, categoryName: "Исходящий перевод", categoryType: "expense", categoryShortName: "💸"});
    });

    it("recognizes an incoming transfer", async () => {
      const transfer: Transaction = {...transactions[0], categoryId: TRANSFER_IN_CATEGORY_ID, transferId: "transfer-1"};
      dependencies.repository.getById.mockResolvedValue(transfer);
      await expect(dependencies.service.getById(transfer.id)).resolves.toEqual({...transfer, categoryName: "Входящий перевод", categoryType: "income", categoryShortName: "💸"});
    });
  });

  describe("getTransferById", () => {
    it("returns null when no transactions belong to the transfer", async () => {
      dependencies.repository.getAll.mockResolvedValue([]);
      await expect(dependencies.service.getTransferById("missing")).resolves.toBeNull();
      expect(dependencies.repository.getAll).toHaveBeenCalledWith({transferId: "missing"});
    });

    it("throws when the transfer does not contain exactly two opposite transactions", async () => {
      dependencies.repository.getAll.mockResolvedValue([transactions[0]]);
      await expect(dependencies.service.getTransferById("transfer-1")).rejects.toThrow("Transfer corrupted");
    });

    it("throws when two transactions do not have opposite transfer categories", async () => {
      dependencies.repository.getAll.mockResolvedValue([{...transactions[0], transferId: "transfer-1"}, {...transactions[1], transferId: "transfer-1"}]);
      await expect(dependencies.service.getTransferById("transfer-1")).rejects.toThrow("Transfer corrupted");
    });

    it("returns transfer details from the paired transactions", async () => {
      dependencies.repository.getAll.mockResolvedValue([
        {...transactions[0], categoryId: TRANSFER_OUT_CATEGORY_ID, transferId: "transfer-1"},
        {...transactions[1], categoryId: TRANSFER_IN_CATEGORY_ID, transferId: "transfer-1", amount: 100, date: "2024-01-01"},
      ]);
      await expect(dependencies.service.getTransferById("transfer-1")).resolves.toEqual({transferId: "transfer-1", fromAccountId: "cash", toAccountId: "card", amount: 100, date: "2024-01-01"});
    });
  });

  describe("create and update", () => {
    it("reports every invalid transaction field and does not persist it", async () => {
      await expect(dependencies.service.create({amount: 0, categoryId: "", accountId: "", date: "invalid"})).rejects.toThrow("Сумма должна быть положительным числом Не указана категория Не указан счёт Дата должна быть в формате ISO и быть валидной");
      expect(dependencies.repository.create).not.toHaveBeenCalled();
    });

    it("rejects missing referenced category and account", async () => {
      await expect(dependencies.service.create({...validTransaction, categoryId: "missing-category", accountId: "missing-account"})).rejects.toThrow("Категория не найдена Счёт не найден");
    });

    it("creates a validated transaction with the original payload", async () => {
      const created = {...validTransaction, id: "transaction-3"};
      dependencies.repository.create.mockResolvedValue(created);
      await expect(dependencies.service.create(validTransaction)).resolves.toEqual(created);
      expect(dependencies.repository.create).toHaveBeenCalledWith(validTransaction);
    });

    it("updates a validated partial transaction with its id", async () => {
      const payload = {amount: 120, categoryId: "food", accountId: "cash", date: "2024-01-02", comment: "updated"};
      dependencies.repository.update.mockResolvedValue({...transactions[0], comment: "updated"});
      await expect(dependencies.service.update("transaction-1", payload)).resolves.toEqual({...transactions[0], comment: "updated"});
      expect(dependencies.repository.update).toHaveBeenCalledWith("transaction-1", payload);
    });
  });

  describe("delete", () => {
    it("deletes a regular transaction", async () => {
      dependencies.repository.getById.mockResolvedValue(transactions[0]);
      await dependencies.service.delete("transaction-1");
      expect(dependencies.repository.delete).toHaveBeenCalledWith("transaction-1");
    });

    it("allows deleting an already missing transaction", async () => {
      dependencies.repository.getById.mockResolvedValue(null);
      await dependencies.service.delete("missing");
      expect(dependencies.repository.delete).toHaveBeenCalledWith("missing");
    });

    it("rejects deleting one side of a transfer", async () => {
      dependencies.repository.getById.mockResolvedValue({...transactions[0], transferId: "transfer-1"});
      await expect(dependencies.service.delete("transaction-1")).rejects.toThrow("Нельзя удалить транзакцию перевода напрямую");
      expect(dependencies.repository.delete).not.toHaveBeenCalled();
    });
  });

  describe("transfer mutations", () => {
    it("reports all invalid transfer fields and does not create a transfer", async () => {
      await expect(dependencies.service.createTransfer({fromAccountId: "", toAccountId: "", amount: 0, date: "invalid"})).rejects.toThrow("Не указаны счета Счета должны отличаться Сумма должна быть положительной Некорректная дата Счет отправителя не найден Счет получателя не найден");
      expect(dependencies.repository.createTransfer).not.toHaveBeenCalled();
    });

    it("rejects a transfer when an account does not exist", async () => {
      await expect(dependencies.service.createTransfer({...validTransfer, toAccountId: "missing-account"})).rejects.toThrow("Счет получателя не найден");
    });

    it("creates paired transactions with transfer system categories", async () => {
      const created: [Transaction, Transaction] = [
        {...transactions[0], transferId: "transfer-1", categoryId: TRANSFER_OUT_CATEGORY_ID, amount: 300, date: "2024-01-03"},
        {...transactions[1], transferId: "transfer-1", categoryId: TRANSFER_IN_CATEGORY_ID, amount: 300, date: "2024-01-03"},
      ];
      dependencies.repository.createTransfer.mockResolvedValue(created);
      await expect(dependencies.service.createTransfer(validTransfer)).resolves.toEqual(created);
      expect(dependencies.repository.createTransfer).toHaveBeenCalledWith(
        {accountId: "cash", categoryId: TRANSFER_OUT_CATEGORY_ID, amount: 300, date: "2024-01-03"},
        {accountId: "card", categoryId: TRANSFER_IN_CATEGORY_ID, amount: 300, date: "2024-01-03"}
      );
    });

    it("updates a validated transfer", async () => {
      await dependencies.service.updateTransfer("transfer-1", validTransfer);
      expect(dependencies.repository.updateTransfer).toHaveBeenCalledWith("transfer-1", validTransfer);
    });

    it("delegates transfer deletion to the repository", async () => {
      await dependencies.service.deleteTransfer("transfer-1");
      expect(dependencies.repository.deleteTransfer).toHaveBeenCalledWith("transfer-1");
    });
  });
});
