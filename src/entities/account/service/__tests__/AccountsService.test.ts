import {beforeEach, describe, expect, jest, test} from "@jest/globals";

import type {Account} from "../../model/Account";
import type {IAccountsRepository} from "../../repository/IAccountsRepository";
import {AccountsService} from "../AccountsService";

const mockRepo: jest.Mocked<IAccountsRepository> = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const service = new AccountsService(mockRepo);

const validAccount: Omit<Account, "id" | "creationDatetime"> = {
  name: "Food",
  currency: "RUB",
};

describe("AccountsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getById calls Repo with correct ID", async () => {
    const account = {id: "1", ...validAccount, creationDatetime: new Date().toUTCString()};
    mockRepo.getById.mockResolvedValueOnce(account);
    const result = await service.getById("1");
    expect(mockRepo.getById).toHaveBeenCalledWith("1");
    expect(result).toEqual(account);
  });

  test("create calls validateAccount and Repo with formatted data", async () => {
    const created: Account = {
      id: "123",
      ...validAccount,
      creationDatetime: "2024-01-01T00:00:00Z",
    };

    mockRepo.create.mockResolvedValueOnce(created);
    const result = await service.create(validAccount);

    expect(mockRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Food",
        currency: "RUB",
        creationDatetime: expect.any(String),
      })
    );
    expect(result).toBe(created);
  });

  test("update calls validateAccount and Repo", async () => {
    const updated = {...validAccount, creationDatetime: new Date().toUTCString(), id: "1"};
    mockRepo.update.mockResolvedValueOnce(updated);
    const result = await service.update("1", validAccount);
    expect(mockRepo.update).toHaveBeenCalledWith("1", validAccount);
    expect(result).toBe(updated);
  });

  test("delete calls Repo with correct ID", async () => {
    mockRepo.delete.mockResolvedValueOnce();
    await service.delete("1");
    expect(mockRepo.delete).toHaveBeenCalledWith("1");
  });

  describe("validateAccount", () => {
    test("throws error if name is empty", () => {
      expect(() => service.validateAccount({name: "   ", currency: "RUB"})).toThrow(
        "Название счета не может быть пустым"
      );
    });

    test("throws error if name is not a string", () => {
      expect(() => service.validateAccount({name: 123, currency: "RUB"})).toThrow(
        "Название счета не может быть пустым"
      );
    });

    test("throws error if currency is empty", () => {
      expect(() => service.validateAccount({name: "sdsd", currency: ""})).toThrow("Валюта не может быть пустой");
    });

    test("throws error if currency is not a string", () => {
      expect(() => service.validateAccount({name: "123", currency: 1})).toThrow("Валюта не может быть пустой");
    });

    test("does not throw if account is valid", () => {
      expect(() => service.validateAccount(validAccount)).not.toThrow();
    });
  });
});
