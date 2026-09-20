import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {Category} from "../model/Category";
import {categoriesService} from "../service/CategoriesService";

export const getCreateCategoryMutationKey = () => ["createCategory"] as const;

export const useCreateCategory = () => {
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
