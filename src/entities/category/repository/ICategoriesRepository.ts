import type {Category, CategoryType} from "../model/Category";

export interface ICategoriesRepository {
  getAll(filter: {type?: CategoryType}): Promise<Category[]>;
  getById(id: string): Promise<Category | null>;
  create(category: Omit<Category, "id">): Promise<Category>;
  update(id: string, category: Partial<Omit<Category, "id">>): Promise<Category | null>;
  delete(id: string): Promise<void>;
}
