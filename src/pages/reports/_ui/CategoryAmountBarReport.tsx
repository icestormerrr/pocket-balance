import type {CategoryAmountChartData} from "@/pages/reports/_model/useAmountByCategoriesChart";
import {Card, CardContent} from "@/shared/ui/card";
import {type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/shared/ui/chart";
import {Bar, BarChart, CartesianGrid, XAxis} from "recharts";

type Props = {
  chartData: CategoryAmountChartData[];
  chartConfig: ChartConfig;
};

export function CategoryAmountBarReport({chartData, chartConfig}: Props) {
  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="categoryName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="amount" name={"Сумма"} fill="fill" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
