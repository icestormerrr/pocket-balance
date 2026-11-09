import {useQuery} from "@tanstack/react-query";
import type {Category} from "@/core/category/domain/Category";
import type {CategoriesFilter} from "@/core/category/service/ICategoriesService";
import {useCategoriesService} from "./CategoriesServiceProvider";

export const getCategoriesQueryKey = (filter: CategoriesFilter) => ["categories", filter?.type] as const;

export const useCategories = (filter: CategoriesFilter) => {
  const categoriesService = useCategoriesService();
  return useQuery<Category[]>({
    queryKey: getCategoriesQueryKey(filter),
    queryFn: () => categoriesService.getAll(filter),
  });
};
