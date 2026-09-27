import {beforeEach, describe, expect, it, jest} from "@jest/globals";

import type {Category, CategoryType} from "../../model/Category";
import type {ICategoriesRepository} from "../../repository/ICategoriesRepository";
import {CategoriesService} from "../CategoriesService";

type RepositoryMock = jest.Mocked<ICategoriesRepository>;

const validCategory = {name: "Food", shortName: "🍔", type: "expense" as CategoryType, color: "#FFAA00"};
const storedCategory: Category = {id: "category-1", ...validCategory, creationDatetime: "2024-01-01T00:00:00.000Z"};

const createRepositoryMock = (): RepositoryMock => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe("CategoriesService", () => {
  let repository: RepositoryMock;
  let service: CategoriesService;

  beforeEach(() => {
    repository = createRepositoryMock();
    service = new CategoriesService(repository);
  });

  it("forwards getAll filters and returns repository categories", async () => {
    repository.getAll.mockResolvedValue([storedCategory]);
    const filter = {type: "expense" as CategoryType};

    await expect(service.getAll(filter)).resolves.toEqual([storedCategory]);
    expect(repository.getAll).toHaveBeenCalledWith(filter);
  });

  it("returns a category from getById", async () => {
    repository.getById.mockResolvedValue(storedCategory);

    await expect(service.getById("category-1")).resolves.toEqual(storedCategory);
    expect(repository.getById).toHaveBeenCalledWith("category-1");
  });

  it("returns null when getById cannot find a category", async () => {
    repository.getById.mockResolvedValue(null);
    await expect(service.getById("missing")).resolves.toBeNull();
  });

  it("creates a valid category with an ISO creation timestamp", async () => {
    repository.create.mockResolvedValue(storedCategory);

    await expect(service.create(validCategory)).resolves.toEqual(storedCategory);
    expect(repository.create).toHaveBeenCalledWith({...validCategory, creationDatetime: expect.any(String)});
    const [{creationDatetime}] = repository.create.mock.calls[0];
    expect(Date.parse(creationDatetime)).not.toBeNaN();
    expect(creationDatetime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?[+-]\d{2}:\d{2}$/);
  });

  it("does not create an invalid category", async () => {
    await expect(service.create({...validCategory, shortName: ""})).rejects.toThrow("Аббревиатура/иконка категории не может быть пустой");
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("updates a complete category payload", async () => {
    const payload = {...validCategory, name: "Restaurants"};
    repository.update.mockResolvedValue({...storedCategory, name: "Restaurants"});

    await expect(service.update("category-1", payload)).resolves.toEqual({...storedCategory, name: "Restaurants"});
    expect(repository.update).toHaveBeenCalledWith("category-1", payload);
  });

  it("updates a valid partial category payload", async () => {
    repository.update.mockResolvedValue({...storedCategory, color: "#00AAFF"});

    await expect(service.update("category-1", {color: "#00AAFF"})).resolves.toEqual({...storedCategory, color: "#00AAFF"});
    expect(repository.update).toHaveBeenCalledWith("category-1", {color: "#00AAFF"});
  });

  it("does not update when a provided partial field is invalid", async () => {
    await expect(service.update("category-1", {shortName: "long"})).rejects.toThrow("Аббревиатура/иконка категории не может быть длиннее нескольких символов");
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("delegates deletion to the repository", async () => {
    await service.delete("category-1");
    expect(repository.delete).toHaveBeenCalledWith("category-1");
  });

  describe("validateCategory", () => {
    it.each([
      [null, "Некорректная категория"],
      ["category", "Некорректная категория"],
      [{shortName: "F", type: "expense", color: "#FFFFFF"}, "Название категории не может быть пустым"],
      [{name: " ", shortName: "F", type: "expense", color: "#FFFFFF"}, "Название категории не может быть пустым"],
      [{name: "Food", type: "expense", color: "#FFFFFF"}, "Аббревиатура/иконка категории не может быть пустой"],
      [{name: "Food", shortName: " ", type: "expense", color: "#FFFFFF"}, "Аббревиатура/иконка категории не может быть пустой"],
      [{name: "Food", shortName: "Food", type: "expense", color: "#FFFFFF"}, "Аббревиатура/иконка категории не может быть длиннее нескольких символов"],
      [{name: "Food", shortName: "F", type: "transfer", color: "#FFFFFF"}, "Тип категории должен быть 'income' или 'expense'"],
      [{name: "Food", shortName: "F", type: "expense", color: "blue"}, "Цвет должен быть в формате HEX, например #FFAA00"],
    ])("rejects %j with the expected error", (payload, message) => {
      expect(() => service.validateCategory(payload)).toThrow(message);
    });

    it("accepts a complete valid category and an empty partial update", () => {
      expect(() => service.validateCategory(validCategory)).not.toThrow();
      expect(() => service.validateCategory({}, true)).not.toThrow();
    });
  });
});
