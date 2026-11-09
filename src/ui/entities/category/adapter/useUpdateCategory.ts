import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {Category} from "@/core/category/domain/Category";
import {useCategoriesService} from "./CategoriesServiceProvider";

export const getUpdateCategoryMutationKey = () => ["updateCategory"] as const;

export const useUpdateCategory = () => {
  const categoriesService = useCategoriesService();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getUpdateCategoryMutationKey(),
    mutationFn: ({id, data}: {id: string; data: Partial<Omit<Category, "id">>}) => categoriesService.update(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({predicate: query => query.queryKey.includes("categories")});
      void queryClient.invalidateQueries({predicate: query => query.queryKey.includes("category")});
    },
  });
};
