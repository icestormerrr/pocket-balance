import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {Category} from "@/core/category/domain/Category";
import {useCategoriesService} from "./CategoriesServiceProvider";

export const getCreateCategoryMutationKey = () => ["createCategory"] as const;

export const useCreateCategory = () => {
  const categoriesService = useCategoriesService();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getCreateCategoryMutationKey(),
    mutationFn: (data: Omit<Category, "id" | "creationDatetime">) => categoriesService.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({predicate: query => query.queryKey.includes("categories")});
      void queryClient.invalidateQueries({predicate: query => query.queryKey.includes("category")});
    },
  });
};
