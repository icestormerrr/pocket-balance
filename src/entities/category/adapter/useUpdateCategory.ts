import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {Category} from "../model/Category";
import {categoriesService} from "../service/CategoriesService";

export const getUpdateCategoryMutationKey = () => ["updateCategory"] as const;

export const useUpdateCategory = () => {
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
