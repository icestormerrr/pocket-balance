import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis} from "recharts";

import {Card, CardContent} from "@/shared/ui/card";
import {type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/shared/ui/chart";

type Point = {
  label: string; // подпись периода (YYYY | YYYY-MM | YYYY-MM-DD)
  periodStart: string; // ISO начала периода
  income: number;
  expense: number;
  balance: number;
};

type Props = {
  data?: Point[];
};

const chartConfig: ChartConfig = {
  income: {label: "Доход"},
  expense: {label: "Расход"},
  balance: {label: "Баланс"},
};

export const BalanceLineChart = ({data}: Props) => {
  return (
    <Card className="flex flex-col p-2">
      <CardContent className="flex-1 p-0">
        <ChartContainer config={chartConfig} className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="balance" name="Баланс" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
