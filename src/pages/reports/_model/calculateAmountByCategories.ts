import type {Category} from "@/entities/category/model/types";
import type {Operation} from "@/entities/operation";

export const calculateAmountByCategories = (operations: Operation[], categories: Record<string, Category>) => {
  const amountsByCategories = operations.reduce(
    (result, operation) => {
      if (result[operation.categoryId]) result[operation.categoryId] += Number(operation.amount);
      else result[operation.categoryId] = Number(operation.amount);
      return result;
    },
    {} as Record<string, number>
  );
  return Object.entries(amountsByCategories).map(([key, value]) => ({
    categoryName: categories[key]?.name,
    amount: value,
    fill: categories[key]?.color,
  }));
};
