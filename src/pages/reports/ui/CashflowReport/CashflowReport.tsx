import {useMemo, useState} from "react";
import {Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis} from "recharts";

import {useCashflowReport, type TransactionDateFilterType} from "@/entities/transaction";
import {Card, CardContent} from "@/shared/ui/card";
import {type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent} from "@/shared/ui/chart";
import {SegmentInput} from "@/shared/ui/tabs";

import {EmptyReportState, MetricCard, ReportSectionHeader, formatCurrency} from "../shared";

type Props = {
  filter: TransactionDateFilterType;
  accountId?: string;
};

type Granularity = "month" | "day";

const GRANULARITY_OPTIONS: {label: string; value: Granularity}[] = [
  {label: "Месяцы", value: "month"},
  {label: "Дни", value: "day"},
];

const chartConfig: ChartConfig = {
  income: {label: "Доходы", color: "var(--positive-accent)"},
  expense: {label: "Расходы", color: "var(--negative-accent)"},
  net: {label: "Чистый результат", color: "oklch(0.45 0.03 250)"},
};

export const CashflowReport = ({filter, accountId}: Props) => {
  const [granularity, setGranularity] = useState<Granularity>("day");
  const {data} = useCashflowReport({
    startDate: filter.startDate,
    endDate: filter.endDate,
    accountId,
    granularity,
  });

  const totals = useMemo(() => {
    return (
      data?.reduce(
        (acc, item) => {
          acc.income += item.income;
          acc.expense += item.expense;
          acc.net += item.net;
          return acc;
        },
        {income: 0, expense: 0, net: 0}
      ) ?? {income: 0, expense: 0, net: 0}
    );
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <ReportSectionHeader
          title="Денежный поток"
          description="Показывает, как меняются доходы, расходы и итог периода."
        />
        <SegmentInput value={granularity} onChange={value => setGranularity(value as Granularity)} options={GRANULARITY_OPTIONS} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Доходы" value={formatCurrency(totals.income)} tone="positive" />
        <MetricCard label="Расходы" value={formatCurrency(totals.expense)} tone="negative" />
        <MetricCard label="Чистый результат" value={formatCurrency(totals.net)} tone={totals.net >= 0 ? "positive" : "negative"} />
      </div>

      {!data?.length ? (
        <EmptyReportState title="Нет данных для построения cashflow" />
      ) : (
        <Card className="rounded-[1.5rem] border-border/70 py-4 shadow-none">
          <CardContent className="px-4">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ComposedChart data={data}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="income" fill="var(--color-income)" radius={[10, 10, 0, 0]} />
                <Bar dataKey="expense" fill="var(--color-expense)" radius={[10, 10, 0, 0]} />
                <Line type="monotone" dataKey="net" stroke="var(--color-net)" strokeWidth={2.5} dot={false} />
              </ComposedChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
