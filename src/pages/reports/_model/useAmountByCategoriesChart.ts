import {type CategoryType, useCategoryStore} from "@/entities/category";
import {useOperationStore} from "@/entities/operation";
import type {ChartConfig} from "@/shared/ui/chart";
import {useMemo} from "react";
import {calculateAmountByCategories} from "./calculateAmountByCategories";

export type CategoryAmountChartData = {categoryName: string; amount: number; fill: string};

export const useAmountByCategoriesChart = (
  selectedType: CategoryType = "expense",
  selectedYear?: number,
  selectedMonth?: number // 0 = Январь, 11 = Декабрь
) => {
  const operations = useOperationStore(s => s.operations);
  const categories = useCategoryStore(s => s.categories);

  const chartData: {categoryName: string; amount: number; fill: string}[] = useMemo(() => {
    const filteredOperations = operations.filter(op => {
      const date = new Date(op.date);
      const isSameYear = selectedYear == null || date.getFullYear() === selectedYear;
      const isSameMonth = selectedMonth == null || date.getMonth() === selectedMonth;
      const isSameType = categories[op.categoryId].type === selectedType;
      return isSameYear && isSameMonth && isSameType;
    });
    return calculateAmountByCategories(filteredOperations, categories);
  }, [operations, selectedYear, selectedMonth, selectedType, categories]);

  const chartConfig: ChartConfig = {
    categoryName: {
      label: "Категория",
    },
  };

  const {years, months} = useMemo(() => {
    const dates = operations.map(d => new Date(d.date));
    const years = Array.from(new Set(dates.map(d => d.getFullYear())));
    const months = Array.from(new Set(dates.map(d => d.getMonth())));
    return {years, months};
  }, [operations]);

  return {chartData, chartConfig, years, months};
};
