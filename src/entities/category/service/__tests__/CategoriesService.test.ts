import {beforeEach, describe, expect, jest, test} from "@jest/globals";

import type {ICategoriesApi} from "../../api/ICategoriesApi";
import type {Category, CategoryType} from "../../model/Category";
import {CategoriesService} from "../CategoriesService";

const mockApi: jest.Mocked<ICategoriesApi> = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const service = new CategoriesService(mockApi);

const validCategory: Omit<Category, "id" | "creationDatetime"> = {
  name: "Food",
  type: "expense",
  color: "#FFAA00",
};

describe("CategoriesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getAll calls API with correct filter", async () => {
    const filter = {type: "income" as CategoryType};
    mockApi.getAll.mockResolvedValueOnce([]);
    const result = await service.getAll(filter);
    expect(mockApi.getAll).toHaveBeenCalledWith(filter);
    expect(result).toEqual([]);
  });

  test("getById calls API with correct ID", async () => {
    const category = {id: "1", ...validCategory, creationDatetime: new Date().toUTCString()};
    mockApi.getById.mockResolvedValueOnce(category);
    const result = await service.getById("1");
    expect(mockApi.getById).toHaveBeenCalledWith("1");
    expect(result).toEqual(category);
  });

  test("create calls validateCategory and API with formatted data", async () => {
    const created: Category = {
      id: "123",
      ...validCategory,
      creationDatetime: "2024-01-01T00:00:00Z",
    };

    mockApi.create.mockResolvedValueOnce(created);
    const result = await service.create(validCategory);

    expect(mockApi.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Food",
        type: "expense",
        color: "#FFAA00",
        creationDatetime: expect.any(String),
      })
    );
    expect(result).toBe(created);
  });

  test("update calls validateCategory and API", async () => {
    const updated = {...validCategory, creationDatetime: new Date().toUTCString(), id: "1"};
    mockApi.update.mockResolvedValueOnce(updated);
    const result = await service.update("1", validCategory);
    expect(mockApi.update).toHaveBeenCalledWith("1", validCategory);
    expect(result).toBe(updated);
  });

  test("delete calls API with correct ID", async () => {
    mockApi.delete.mockResolvedValueOnce();
    await service.delete("1");
    expect(mockApi.delete).toHaveBeenCalledWith("1");
  });

  describe("validateCategory", () => {
    test("throws error if name is empty", () => {
      expect(() => service.validateCategory({name: "   ", type: "income", color: "#FFFFFF"})).toThrow(
        "Название категории не может быть пустым"
      );
    });

    test("throws error if name is not a string", () => {
      expect(() => service.validateCategory({name: 123, type: "income", color: "#FFFFFF"})).toThrow(
        "Название категории не может быть пустым"
      );
    });

    test("throws error if type is invalid", () => {
      expect(() => service.validateCategory({name: "Food", type: "invalid", color: "#FFFFFF"})).toThrow(
        "Тип категории должен быть 'income' или 'expense'"
      );
    });

    test("throws error if color is not a hex", () => {
      expect(() => service.validateCategory({name: "Food", type: "expense", color: "red"})).toThrow(
        "Цвет должен быть в формате HEX, например #FFAA00"
      );
    });

    test("does not throw if category is valid", () => {
      expect(() => service.validateCategory(validCategory)).not.toThrow();
    });
  });
});
