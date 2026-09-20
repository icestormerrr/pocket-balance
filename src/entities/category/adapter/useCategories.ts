import {useQuery} from "@tanstack/react-query";
import type {Category} from "../model/Category";
import {categoriesService} from "../service/CategoriesService";
import type {CategoriesFilter} from "../service/ICategoriesService";

export const getCategoriesQueryKey = (filter: CategoriesFilter) => ["categories", filter?.type] as const;

export const useCategories = (filter: CategoriesFilter) => {
  return useQuery<Category[]>({
    queryKey: getCategoriesQueryKey(filter),
    queryFn: () => categoriesService.getAll(filter),
  });
};
