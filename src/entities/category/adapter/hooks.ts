import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import type {Category} from "../model/Category";
import {categoriesService} from "../service/CategoriesService";
import type {CategoriesFilter} from "../service/ICategoriesService";

export const useCategories = (filter: CategoriesFilter) => {
  return useQuery<Category[]>({
    queryKey: ["categories", filter?.type],
    queryFn: () => categoriesService.getAll(filter),
  });
};

export const useCategory = (id?: string) => {
  return useQuery<Category | null>({
    queryKey: ["category", id],
    queryFn: () => categoriesService.getById(id!),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Category, "id" | "creationDatetime">) => categoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("categories")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("category")});
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, data}: {id: string; data: Partial<Omit<Category, "id">>}) => categoriesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("categories")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("category")});
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("categories")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("category")});
    },
  });
};
