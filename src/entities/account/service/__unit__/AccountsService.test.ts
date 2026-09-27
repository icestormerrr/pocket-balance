import {beforeEach, describe, expect, it, jest} from "@jest/globals";

import type {Account} from "../../model/Account";
import type {IAccountsRepository} from "../../repository/IAccountsRepository";
import {AccountsService} from "../AccountsService";

type RepositoryMock = jest.Mocked<IAccountsRepository>;

const validAccount = {name: "Cash", currencyCode: "RUB", startAmount: 1_000};
const storedAccount: Account = {id: "account-1", ...validAccount, creationDatetime: "2024-01-01T00:00:00.000Z"};

const createRepositoryMock = (): RepositoryMock => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe("AccountsService", () => {
  let repository: RepositoryMock;
  let service: AccountsService;

  beforeEach(() => {
    repository = createRepositoryMock();
    service = new AccountsService(repository);
  });

  it("forwards getAll filters and returns repository accounts", async () => {
    repository.getAll.mockResolvedValue([storedAccount]);
    const filter = {currencyCode: "RUB"};

    await expect(service.getAll(filter)).resolves.toEqual([storedAccount]);
    expect(repository.getAll).toHaveBeenCalledWith(filter);
  });

  it("returns an account from getById", async () => {
    repository.getById.mockResolvedValue(storedAccount);

    await expect(service.getById("account-1")).resolves.toEqual(storedAccount);
    expect(repository.getById).toHaveBeenCalledWith("account-1");
  });

  it("returns null when getById cannot find an account", async () => {
    repository.getById.mockResolvedValue(null);

    await expect(service.getById("missing")).resolves.toBeNull();
  });

  it("creates a valid account with an ISO creation timestamp", async () => {
    repository.create.mockResolvedValue(storedAccount);

    await expect(service.create(validAccount)).resolves.toEqual(storedAccount);
    expect(repository.create).toHaveBeenCalledWith({...validAccount, creationDatetime: expect.any(String)});
    const [{creationDatetime}] = repository.create.mock.calls[0];
    expect(Date.parse(creationDatetime)).not.toBeNaN();
    expect(creationDatetime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?[+-]\d{2}:\d{2}$/);
  });

  it("does not create an invalid account", async () => {
    await expect(service.create({...validAccount, name: "  "})).rejects.toThrow("Название счета не может быть пустым");
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("updates a complete account payload", async () => {
    repository.update.mockResolvedValue({...storedAccount, name: "Savings"});
    const payload = {...validAccount, name: "Savings"};

    await expect(service.update("account-1", payload)).resolves.toEqual({...storedAccount, name: "Savings"});
    expect(repository.update).toHaveBeenCalledWith("account-1", payload);
  });

  it("updates a valid partial payload", async () => {
    repository.update.mockResolvedValue({...storedAccount, name: "Savings"});

    await expect(service.update("account-1", {name: "Savings"})).resolves.toEqual({...storedAccount, name: "Savings"});
    expect(repository.update).toHaveBeenCalledWith("account-1", {name: "Savings"});
  });

  it("does not update when a provided partial field is invalid", async () => {
    await expect(service.update("account-1", {startAmount: -1})).rejects.toThrow("Начальная сумма не может быть пустой");
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("delegates deletion to the repository", async () => {
    await service.delete("account-1");
    expect(repository.delete).toHaveBeenCalledWith("account-1");
  });

  describe("validateAccount", () => {
    it.each([
      [null, "Некорректный счет"],
      ["account", "Некорректный счет"],
      [{currencyCode: "RUB", startAmount: 1}, "Название счета не может быть пустым"],
      [{name: " ", currencyCode: "RUB", startAmount: 1}, "Название счета не может быть пустым"],
      [{name: "Cash", currencyCode: "RUB"}, "Начальная сумма не может быть пустой"],
      [{name: "Cash", currencyCode: "RUB", startAmount: Number.NaN}, "Начальная сумма не может быть пустой"],
      [{name: "Cash", currencyCode: "RUB", startAmount: -1}, "Начальная сумма не может быть пустой"],
      [{name: "Cash", startAmount: 1}, "Валюта не может быть пустой"],
      [{name: "Cash", currencyCode: " ", startAmount: 1}, "Валюта не может быть пустой"],
    ])("rejects %j with the expected error", (payload, message) => {
      expect(() => service.validateAccount(payload)).toThrow(message);
    });

    it("accepts a complete valid account and an empty partial update", () => {
      expect(() => service.validateAccount(validAccount)).not.toThrow();
      expect(() => service.validateAccount({}, true)).not.toThrow();
    });
  });
});
