import {CategoriesLocalStorageApi} from "@/entities/category/api/CategoriesLocalStorageApi";
import type {ICategoriesApi} from "../api/ICategoriesApi";
import type {Category} from "../model/Category";
import type {
  CategoriesFilter,
  CategoryCreatePayload,
  CategoryUpdatePayload,
  ICategoriesService,
} from "./ICategoriesService";

export class CategoriesService implements ICategoriesService {
  private readonly api: ICategoriesApi;

  constructor(api: ICategoriesApi) {
    this.api = api;
  }

  async getAll(filter: CategoriesFilter): Promise<Category[]> {
    return this.api.getAll(filter);
  }

  async getById(id: string): Promise<Category | null> {
    return this.api.getById(id);
  }

  // дописать проверку на лишние поля
  validateCategory(data: unknown) {
    if (typeof data !== "object" || data === null) {
      throw new Error("Некорректная категория");
    }

    if (!("name" in data) || typeof data.name !== "string" || data.name.trim().length === 0) {
      throw new Error("Название категории не может быть пустым");
    }

    if (!("type" in data) || (data.type !== "expense" && data.type !== "income")) {
      throw new Error("Тип категории должен быть 'income' или 'expense'");
    }

    if (!("color" in data) || typeof data.color !== "string" || !/^#[0-9A-F]{6}$/i.test(data.color)) {
      throw new Error("Цвет должен быть в формате HEX, например #FFAA00");
    }
  }

  async create(category: CategoryCreatePayload): Promise<Category> {
    this.validateCategory(category);
    return this.api.create({
      ...category,
      creationDatetime: new Date().toUTCString(),
    });
  }

  async update(id: string, category: CategoryUpdatePayload): Promise<Category | null> {
    this.validateCategory(category);
    return this.api.update(id, category);
  }

  async delete(id: string): Promise<void> {
    return this.api.delete(id);
  }
}

export const categoriesService = new CategoriesService(new CategoriesLocalStorageApi());
