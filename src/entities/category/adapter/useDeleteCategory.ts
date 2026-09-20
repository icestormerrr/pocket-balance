import {useMutation, useQueryClient} from "@tanstack/react-query";
import {categoriesService} from "../service/CategoriesService";

export const getDeleteCategoryMutationKey = () => ["deleteCategory"] as const;

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getDeleteCategoryMutationKey(),
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({predicate: query => query.queryKey.includes("categories")});
      void queryClient.invalidateQueries({predicate: query => query.queryKey.includes("category")});
    },
  });
};
