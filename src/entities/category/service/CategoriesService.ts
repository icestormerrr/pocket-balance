import {CategoriesLocalStorageApi} from "@/entities/category/api/CategoriesLocalStorageApi";
import type {ICategoriesApi} from "../api/ICategoriesApi";
import type {Category, CategoryType} from "../model/Category";
import type {ICategoriesService} from "./ICategoriesService";

export class CategoriesService implements ICategoriesService {
  private readonly api: ICategoriesApi;

  constructor(api: ICategoriesApi) {
    this.api = api;
  }

  async getAll(filter: {type?: CategoryType}): Promise<Category[]> {
    return this.api.getAll(filter);
  }

  async getById(id: string): Promise<Category | null> {
    return this.api.getById(id);
  }

  validateCategory(data: {name?: unknown; type?: unknown; color?: unknown}) {
    if (typeof data.name !== "string" || data.name.trim().length === 0) {
      throw new Error("Название категории не может быть пустым");
    }

    if (data.type !== "expense" && data.type !== "income") {
      throw new Error("Тип категории должен быть 'income' или 'expense'");
    }

    if (typeof data.color !== "string" || !/^#[0-9A-F]{6}$/i.test(data.color)) {
      throw new Error("Цвет должен быть в формате HEX, например #FFAA00");
    }
  }

  async create(category: Omit<Category, "id" | "creationDatetime">): Promise<Category> {
    this.validateCategory(category);
    return this.api.create({
      ...category,
      creationDatetime: new Date().toUTCString(),
    });
  }

  async update(id: string, category: Partial<Omit<Category, "id">>): Promise<Category | null> {
    this.validateCategory(category);
    return this.api.update(id, category);
  }

  async delete(id: string): Promise<void> {
    return this.api.delete(id);
  }
}

export const categoriesService = new CategoriesService(new CategoriesLocalStorageApi());
