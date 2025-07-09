import {categoriesToArray, type CategoryType, useCategoryStore} from "@/entities/category";
import {useMemo} from "react";

export const useCategoryOptions = (categoryType: CategoryType) => {
  const categories = useCategoryStore(state => state.categories);

  return useMemo(
    () =>
      categoriesToArray(categories)
        .filter(c => c.type === categoryType)
        .map(cat => ({label: cat.name, value: cat.id})),
    [categories, categoryType]
  );
};
