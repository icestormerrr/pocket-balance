import type {Category, CategoryType} from "../model/Category";

export interface ICategoriesApi {
  getAll(filter: {type?: CategoryType}): Promise<Category[]>;
  getById(id: string): Promise<Category | null>;
  create(transaction: Omit<Category, "id">): Promise<Category>;
  update(id: string, transaction: Partial<Omit<Category, "id">>): Promise<Category | null>;
  delete(id: string): Promise<void>;
}
