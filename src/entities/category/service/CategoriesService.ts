import {DateConverter} from "@/shared/lib/datetime";
import type {Category} from "../model/Category";
import {CategoryLocalStorageRepository} from "../repository/CategoryLocalStorageRepository";
import type {ICategoriesRepository} from "../repository/ICategoriesRepository";
import type {
  CategoriesFilter,
  CategoryCreatePayload,
  CategoryUpdatePayload,
  ICategoriesService,
} from "./ICategoriesService";

export class CategoriesService implements ICategoriesService {
  private readonly repository: ICategoriesRepository;

  constructor(api: ICategoriesRepository) {
    this.repository = api;
  }

  async getAll(filter: CategoriesFilter): Promise<Category[]> {
    return this.repository.getAll(filter);
  }

  async getById(id: string): Promise<Category | null> {
    return this.repository.getById(id);
  }

  // дописать проверку на лишние поля
  validateCategory(data: unknown, allowPartial = false) {
    if (typeof data !== "object" || data === null) {
      throw new Error("Некорректная категория");
    }
    const category = data as Partial<Category>;

    if ((!allowPartial || "name" in category) && (typeof category.name !== "string" || category.name.trim().length === 0)) {
      throw new Error("Название категории не может быть пустым");
    }

    if ((!allowPartial || "shortName" in category) && (typeof category.shortName !== "string" || category.shortName.trim().length === 0)) {
      throw new Error("Аббревиатура/иконка категории не может быть пустой");
    }

    if (typeof category.shortName === "string" && category.shortName.length > 3) {
      throw new Error("Аббревиатура/иконка категории не может быть длиннее нескольких символов");
    }

    if ((!allowPartial || "type" in category) && (category.type !== "expense" && category.type !== "income")) {
      throw new Error("Тип категории должен быть 'income' или 'expense'");
    }

    if ((!allowPartial || "color" in category) && (typeof category.color !== "string" || !/^#[0-9A-F]{6}$/i.test(category.color))) {
      throw new Error("Цвет должен быть в формате HEX, например #FFAA00");
    }
  }

  async create(category: CategoryCreatePayload): Promise<Category> {
    this.validateCategory(category);
    return this.repository.create({
      ...category,
      creationDatetime: DateConverter.dateToISO(new Date()),
    });
  }

  async update(id: string, category: CategoryUpdatePayload): Promise<Category | null> {
    this.validateCategory(category, true);
    return this.repository.update(id, category);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}

export const categoriesService = new CategoriesService(new CategoryLocalStorageRepository());
