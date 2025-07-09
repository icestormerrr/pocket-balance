import type {Category, CategoryType} from "@/entities/category/model/types";
import {nanoid} from "nanoid";
import {create} from "zustand";
import {devtools, persist} from "zustand/middleware";

type CategoryStore = {
  categories: Record<string, Category>;
  addCategory: (categoryToCreate: Omit<Category, "id" | "creationDatetime">) => void;
  updateCategory: (categoryToUpdate: Omit<Category, "creationDatetime">) => void;
  deleteCategory: (id: string) => void;
  getByType: (type: CategoryType) => Category[];
};

export const useCategoryStore = create<CategoryStore>()(
  devtools(
    persist(
      (set, get) => {
        return {
          categories: {
            "1": {id: "1", name: "Продукты", type: "expense", creationDatetime: "", color: "#FFB3BA"},
            "2": {id: "2", name: "Кафе", type: "expense", creationDatetime: "", color: "#FFDFBA"},
            "3": {id: "3", name: "Одежда", type: "expense", creationDatetime: "", color: "#FFFFBA"},
            "4": {id: "4", name: "Зарплата", type: "income", creationDatetime: "", color: "#BAFFB3"},
          },

          addCategory: categoryToCreate =>
            set(state => {
              const newId = nanoid();
              return {
                categories: {
                  ...state.categories,
                  [newId]: {...categoryToCreate, id: newId, creationDatetime: new Date().toUTCString()},
                },
              };
            }),

          updateCategory: categoryToUpdate =>
            set(state => ({
              categories: {
                ...state.categories,
                [categoryToUpdate.id]: {...state.categories[categoryToUpdate.id], ...categoryToUpdate},
              },
            })),

          deleteCategory: id =>
            set(state => {
              const copyCategories = {...state.categories};
              delete copyCategories[id];
              return {
                categories: copyCategories,
              };
            }),

          getByType: type => {
            return Object.values(get().categories)
              .filter(cat => cat.type === type)
              .toSorted((c1, c2) => (new Date(c1.creationDatetime) > new Date(c2.creationDatetime) ? 1 : -1));
          },
        };
      },
      {
        name: "category-storage",
      }
    )
  )
);

export const categoriesToArray = (categories: CategoryStore["categories"]) =>
  Object.values(categories).toSorted((c1, c2) =>
    new Date(c1.creationDatetime) > new Date(c2.creationDatetime) ? 1 : -1
  );
