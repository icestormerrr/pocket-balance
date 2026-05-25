import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts";

import {useAccountFlowReport, type TransactionDateFilterType} from "@/entities/transaction";
import {Card, CardContent} from "@/shared/ui/card";
import {type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/shared/ui/chart";

import {EmptyReportState, ReportSectionHeader, formatCurrency} from "../shared";

type Props = {
  filter: TransactionDateFilterType;
};

const chartConfig: ChartConfig = {
  expense: {label: "Расходы", color: "var(--negative-accent)"},
};

export const AccountFlowReport = ({filter}: Props) => {
  const {data} = useAccountFlowReport({startDate: filter.startDate, endDate: filter.endDate});

  return (
    <div className="space-y-4">
      <ReportSectionHeader
        title="Активность по счетам"
        description="Показывает, через какие счета проходит основной объём доходов и расходов."
      />

      {!data?.length ? (
        <EmptyReportState title="Нет данных по счетам за выбранный период" />
      ) : (
        <>
          <Card className="rounded-[1.5rem] border-border/70 py-4 shadow-none">
            <CardContent className="px-4">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={data} layout="vertical" margin={{left: 24}}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="accountName" width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="expense" fill="var(--color-expense)" radius={[0, 10, 10, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

          <div className="space-y-3">
            {data.map(item => (
              <Card key={item.accountId} className="rounded-[1.5rem] border-border/70 py-4 shadow-none">
                <CardContent className="grid gap-3 px-4 sm:grid-cols-[1.3fr_1fr_1fr_1fr] sm:items-center">
                  <div>
                    <p className="font-medium">{item.accountName}</p>
                    <p className="text-muted-foreground text-sm">Чистый результат {formatCurrency(item.net)}</p>
                  </div>
                  <Stat label="Доходы" value={formatCurrency(item.income)} tone="positive" />
                  <Stat label="Расходы" value={formatCurrency(item.expense)} tone="negative" />
                  <Stat label="Net" value={formatCurrency(item.net)} tone={item.net >= 0 ? "positive" : "negative"} />
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

function Stat({label, value, tone}: {label: string; value: string; tone: "positive" | "negative"}) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className={tone === "positive" ? "text-[var(--positive-accent)] font-semibold" : "text-[var(--negative-accent)] font-semibold"}>
        {value}
      </p>
    </div>
  );
}
