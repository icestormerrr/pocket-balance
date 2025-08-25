import {useMemo, useState} from "react";

import {CATEGORY_TYPE_OPTIONS, type CategoryType} from "@/entities/category";
import {useCategoriesReport} from "@/entities/transaction";
import {DateConverter, DateCreator} from "@/shared/lib/datetime";
import {SegmentInput} from "@/shared/ui/tabs";
import TransactionsDateFilters, {type TransactionDateFilterType} from "@/widgets/TransactionsDateFilters";

import {CategoriesAmountsList} from "./components/CategoriesAmountsList/CategoriesAmountsList";
import {CategoryAmountPieChart} from "./components/CategoryAmountPieChart/CategoryAmountPieChart";

export const CategoriesReport = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>("expense");
  const [dateFilter, setDateFilter] = useState<TransactionDateFilterType>(() => {
    const {startDate, endDate} = DateCreator.createPeriod(new Date().getFullYear(), new Date().getMonth());
    return {startDate: DateConverter.dateToISO(startDate), endDate: DateConverter.dateToISO(endDate)};
  });

  const {data} = useCategoriesReport({
    startDate: dateFilter.startDate,
    endDate: dateFilter.endDate,
    categoryType: categoryFilter as CategoryType,
  });

  const chartData = useMemo(
    () => data?.map(item => ({...item, fill: item.categoryColor})).sort((item1, item2) => item2.amount - item1.amount),
    [data]
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">По категориям</h1>

        <SegmentInput value={categoryFilter} onChange={setCategoryFilter} options={CATEGORY_TYPE_OPTIONS} />
      </div>

      <TransactionsDateFilters filter={dateFilter} onFilterChange={setDateFilter} />

      <CategoryAmountPieChart chartData={chartData} />

      <CategoriesAmountsList chartData={chartData} />
    </>
  );
};
