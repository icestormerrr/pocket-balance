import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {Category, CategoryType} from "../model/Category";
import {categoriesService} from "../service/CategoriesService";

export const useCategories = (type?: CategoryType) => {
  return useQuery<Category[]>({
    queryKey: ["categories", type],
    queryFn: () => categoriesService.getAll({type}),
  });
};

export const useCategory = (id?: string) => {
  return useQuery<Category | null>({
    queryKey: ["categories", id],
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
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, data}: {id: string; data: Partial<Omit<Category, "id">>}) => categoriesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("categories")});
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("categories")});
    },
  });
};
