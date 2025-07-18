import type {Category, CategoryType} from "../model/Category";

export interface ICategoriesService {
  getAll(filter: CategoriesFilter): Promise<Category[]>;
  getById(id: string): Promise<Category | null>;
  create(tx: CategoryCreatePayload): Promise<Category>;
  update(id: string, tx: CategoryUpdatePayload): Promise<Category | null>;
  delete(id: string): Promise<void>;
}

export interface CategoriesFilter {
  type?: CategoryType;
}

export type CategoryCreatePayload = Omit<Category, "id" | "creationDatetime">;

export type CategoryUpdatePayload = Partial<Omit<Category, "id">>;
