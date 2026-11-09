import {useQuery} from "@tanstack/react-query";
import type {Category} from "@/core/category/domain/Category";
import {useCategoriesService} from "./CategoriesServiceProvider";

export const getCategoryQueryKey = (id?: string) => ["category", id] as const;

export const useCategory = (id?: string) => {
  const categoriesService = useCategoriesService();
  return useQuery<Category | null>({
    queryKey: getCategoryQueryKey(id),
    queryFn: () => categoriesService.getById(id!),
    enabled: !!id,
  });
};
