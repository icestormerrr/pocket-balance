import {ChartColumn, ChartPie} from "lucide-react";
import {useMemo, useState} from "react";

import {CATEGORY_TYPE_OPTIONS} from "@/entities/category";
import type {CategoryType} from "@/entities/category/model/Category";
import {useAmountGroupedByCategory} from "@/entities/transaction/adapter/hooks";
import {DateConverter, DateCreator} from "@/shared/lib/datetime";
import {SegmentInput, Tabs, TabsContent, TabsList, TabsTrigger} from "@/shared/ui/tabs";
import TransactionsDateFilters, {type TransactionDateFilterType} from "@/widgets/TransactionsDateFilters";

import {CategoryAmountBarReport} from "./ui/CategoryAmountBarReport/CategoryAmountBarReport";
import {CategoryAmountListReport} from "./ui/CategoryAmountListReport/CategoryAmountListReport";
import {CategoryAmountPieReport} from "./ui/CategoryAmountPieReport/CategoryAmountPieReport";

const ReportsPage = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>("expense");
  const [dateFilter, setDateFilter] = useState<TransactionDateFilterType>(() => {
    const {startDate, endDate} = DateCreator.createPeriod(new Date().getFullYear(), new Date().getMonth());
    return {startDate: DateConverter.dateToISO(startDate), endDate: DateConverter.dateToISO(endDate)};
  });

  const {data} = useAmountGroupedByCategory({
    startDate: dateFilter.startDate,
    endDate: dateFilter.endDate,
    categoryType: categoryFilter as CategoryType,
  });

  const chartData = useMemo(() => data?.map(item => ({...item, fill: item.categoryColor})), [data]);

  return (
    <div className={"p-4 overflow-y-auto overscroll-contain"}>
      <Tabs defaultValue="pie">
        <div className="flex justify-between items-center">
          <TabsList className="w-30">
            <TabsTrigger value="pie">
              <ChartPie />
            </TabsTrigger>
            <TabsTrigger value="bar">
              <ChartColumn />
            </TabsTrigger>
          </TabsList>
          <SegmentInput value={categoryFilter} onChange={setCategoryFilter} options={CATEGORY_TYPE_OPTIONS} />
        </div>

        <TransactionsDateFilters filter={dateFilter} onFilterChange={setDateFilter} />

        <TabsContent value="pie">
          <CategoryAmountPieReport chartData={chartData} />
        </TabsContent>

        <TabsContent value="bar">
          <CategoryAmountBarReport chartData={chartData} />
        </TabsContent>
      </Tabs>

      <CategoryAmountListReport chartData={chartData} />
    </div>
  );
};

export default ReportsPage;
