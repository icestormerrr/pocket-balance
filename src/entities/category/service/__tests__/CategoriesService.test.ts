import {beforeEach, describe, expect, jest, test} from "@jest/globals";

import type {Category, CategoryType} from "../../model/Category";
import type {ICategoriesRepository} from "../../repository/ICategoriesRepository";
import {CategoriesService} from "../CategoriesService";

const mockRepo: jest.Mocked<ICategoriesRepository> = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const service = new CategoriesService(mockRepo);

const validCategory: Omit<Category, "id" | "creationDatetime"> = {
  name: "Food",
  shortName: "F",
  type: "expense",
  color: "#FFAA00",
};

describe("CategoriesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getAll calls repository with correct filter", async () => {
    const filter = {type: "income" as CategoryType};
    mockRepo.getAll.mockResolvedValueOnce([]);
    const result = await service.getAll(filter);
    expect(mockRepo.getAll).toHaveBeenCalledWith(filter);
    expect(result).toEqual([]);
  });

  test("getById calls Rerepositorypo with correct id", async () => {
    const category = {id: "1", ...validCategory, creationDatetime: new Date().toUTCString()};
    mockRepo.getById.mockResolvedValueOnce(category);
    const result = await service.getById("1");
    expect(mockRepo.getById).toHaveBeenCalledWith("1");
    expect(result).toEqual(category);
  });

  test("create calls validateCategory and repository with cretionDate field", async () => {
    const created: Category = {
      id: "123",
      ...validCategory,
      creationDatetime: "2024-01-01T00:00:00Z",
    };

    mockRepo.create.mockResolvedValueOnce(created);
    const result = await service.create(validCategory);

    expect(mockRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Food",
        type: "expense",
        color: "#FFAA00",
        creationDatetime: expect.any(String),
      })
    );
    expect(result).toBe(created);
  });

  test("update calls validateCategory and repository", async () => {
    const updated = {...validCategory, creationDatetime: new Date().toUTCString(), id: "1"};
    mockRepo.update.mockResolvedValueOnce(updated);
    const result = await service.update("1", validCategory);
    expect(mockRepo.update).toHaveBeenCalledWith("1", validCategory);
    expect(result).toBe(updated);
  });

  test("delete calls repository with correct id", async () => {
    mockRepo.delete.mockResolvedValueOnce();
    await service.delete("1");
    expect(mockRepo.delete).toHaveBeenCalledWith("1");
  });

  describe("validateCategory", () => {
    test("throws error if name is empty", () => {
      expect(() => service.validateCategory({name: "   ", type: "income", color: "#FFFFFF", shortName: "Fo"})).toThrow(
        "Название категории не может быть пустым"
      );
    });

    test("throws error if name is not a string", () => {
      expect(() => service.validateCategory({name: 123, type: "income", color: "#FFFFFF", shortName: "Fo"})).toThrow(
        "Название категории не может быть пустым"
      );
    });

    test("throws error if shortName is not a string", () => {
      expect(() => service.validateCategory({name: "Food", type: "income", color: "#FFFFFF", shortName: 2})).toThrow(
        "Аббревиатура/иконка категории не может быть пустой"
      );
    });

    test("throws error if shortName length is more than maxLength", () => {
      expect(() =>
        service.validateCategory({name: "Food", type: "income", color: "#FFFFFF", shortName: "Food"})
      ).toThrow("Аббревиатура/иконка категории не может быть длиннее нескольких символов");
    });

    test("throws error if type is invalid", () => {
      expect(() =>
        service.validateCategory({name: "Food", type: "invalid", color: "#FFFFFF", shortName: "Fo"})
      ).toThrow("Тип категории должен быть 'income' или 'expense'");
    });

    test("throws error if color is not a hex", () => {
      expect(() => service.validateCategory({name: "Food", type: "expense", color: "red", shortName: "Fo"})).toThrow(
        "Цвет должен быть в формате HEX, например #FFAA00"
      );
    });

    test("does not throw if category is valid", () => {
      expect(() => service.validateCategory(validCategory)).not.toThrow();
    });
  });
});
