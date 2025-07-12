import type {Category, CategoryType} from "../model/Category.ts";

export interface ICategoriesService {
  getAll(filter: {type?: CategoryType}): Promise<Category[]>;
  getById(id: string): Promise<Category | null>;
  create(tx: Omit<Category, "id" | "creationDatetime">): Promise<Category>;
  update(id: string, tx: Partial<Omit<Category, "id">>): Promise<Category | null>;
  delete(id: string): Promise<void>;
}
