import {useQuery} from "@tanstack/react-query";
import type {Category} from "../model/Category";
import {categoriesService} from "../service/CategoriesService";

export const getCategoryQueryKey = (id?: string) => ["category", id] as const;

export const useCategory = (id?: string) => {
  return useQuery<Category | null>({
    queryKey: getCategoryQueryKey(id),
    queryFn: () => categoriesService.getById(id!),
    enabled: !!id,
  });
};
