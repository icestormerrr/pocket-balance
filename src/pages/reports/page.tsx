import {useAmountByCategoriesChart} from "@/pages/reports/_model/useAmountByCategoriesChart";
import {CategoryAmountBarReport} from "@/pages/reports/_ui/CategoryAmountBarReport";
import {CategoryAmountList} from "@/pages/reports/_ui/CategoryAmountList";
import {CategoryAmountPieReport} from "@/pages/reports/_ui/CategoryAmountPieReport";
import {CATEGORY_TYPE_OPTIONS, type CategoryType} from "@/entities/category";
import {months} from "@/shared/lib/datetime";
import {BadgeGroup} from "@/shared/ui/badge";
import {SegmentInput, Tabs, TabsContent, TabsList, TabsTrigger} from "@/shared/ui/tabs";
import {ChartColumn, ChartPie} from "lucide-react";
import {useState} from "react";

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState<string>("expense");
  const [selectedYear, setSelectedYear] = useState<number>();
  const [selectedMonth, setSelectedMonth] = useState<number>();

  const {chartData, chartConfig, years} = useAmountByCategoriesChart(
    selectedType as CategoryType,
    selectedYear,
    selectedMonth
  );

  return (
    <div className={"p-4 max-h-[90vh] overflow-y-auto overscroll-contain"}>
      <Tabs defaultValue="pie">
        <div className="flex justify-between items-center ">
          <TabsList className="w-30">
            <TabsTrigger value="pie">
              <ChartPie />
            </TabsTrigger>
            <TabsTrigger value="bar">
              <ChartColumn />
            </TabsTrigger>
          </TabsList>
          <SegmentInput value={selectedType} onChange={setSelectedType} options={CATEGORY_TYPE_OPTIONS} />
        </div>

        <div className="flex flex-col gap-2 mt-5">
          <BadgeGroup
            value={selectedYear}
            onChange={v => setSelectedYear(v ?? undefined)}
            options={years.map(y => ({label: y.toString(), value: y}))}
          />

          <BadgeGroup value={selectedMonth} onChange={v => setSelectedMonth(v ?? undefined)} options={months} />
        </div>

        <TabsContent value="pie">
          <CategoryAmountPieReport chartConfig={chartConfig} chartData={chartData} />
        </TabsContent>
        <TabsContent value="bar">
          <CategoryAmountBarReport chartConfig={chartConfig} chartData={chartData} />
        </TabsContent>
      </Tabs>
      <CategoryAmountList chartData={chartData} />
    </div>
  );
}
