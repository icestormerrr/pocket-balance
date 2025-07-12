import {CategoriesLocalStorageApi} from "@/entities/category/api/CategoriesLocalStorageApi.ts";
import type {ICategoriesApi} from "../api/ICategoriesApi.ts";
import type {Category, CategoryType} from "../model/Category.ts";
import type {ICategoriesService} from "./ICategoriesService.ts";

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

  async create(tx: Omit<Category, "id" | "creationDatetime">): Promise<Category> {
    return this.api.create({...tx, creationDatetime: new Date().toUTCString()});
  }

  async update(id: string, tx: Partial<Omit<Category, "id">>): Promise<Category | null> {
    return this.api.update(id, tx);
  }

  async delete(id: string): Promise<void> {
    return this.api.delete(id);
  }
}

export const categoriesService = new CategoriesService(new CategoriesLocalStorageApi());
