import type {Category, CategoryType} from "../model/Category";
import type {ICategoriesApi} from "./ICategoriesApi";

const STORAGE_KEY = "categories";

function load(): Category[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function save(categories: Category[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}

export class CategoriesLocalStorageApi implements ICategoriesApi {
  async getAll(filter: {type?: CategoryType}): Promise<Category[]> {
    return load().filter(cat => {
      if (filter.type) {
        return cat.type === filter.type;
      }
      return true;
    });
  }

  async getById(id: string): Promise<Category | null> {
    const categories = load();
    return categories.find(tx => tx.id === id) ?? null;
  }

  async create(category: Omit<Category, "id">): Promise<Category> {
    const categories = load();
    const newTx: Category = {...category, id: crypto.randomUUID()};
    categories.push(newTx);
    save(categories);
    return newTx;
  }

  async update(id: string, partial: Partial<Omit<Category, "id">>): Promise<Category | null> {
    const categories = load();
    const index = categories.findIndex(tx => tx.id === id);
    if (index === -1) return null;

    const updated = {...categories[index], ...partial};
    categories[index] = updated;
    save(categories);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const categories = load().filter(tx => tx.id !== id);
    save(categories);
  }
}
