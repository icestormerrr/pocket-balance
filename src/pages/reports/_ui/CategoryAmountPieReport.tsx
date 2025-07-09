import type {CategoryAmountChartData} from "@/pages/reports/_model/useAmountByCategoriesChart";
import {Card, CardContent} from "@/shared/ui/card";
import {type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/shared/ui/chart";
import {Pie, PieChart} from "recharts";

type Props = {
  chartData: CategoryAmountChartData[];
  chartConfig: ChartConfig;
};

export function CategoryAmountPieReport({chartData, chartConfig}: Props) {
  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={true} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="amount" nameKey="categoryName" fill="fill" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
