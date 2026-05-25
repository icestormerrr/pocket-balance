import {useMemo} from "react";
import {Cell, Pie, PieChart} from "recharts";

import {useExpenseInsightsReport, type TransactionDateFilterType} from "@/entities/transaction";
import {Badge} from "@/shared/ui/badge";
import {Card, CardContent} from "@/shared/ui/card";
import {type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/shared/ui/chart";

import {EmptyReportState, ReportSectionHeader, formatCurrency} from "../shared";

type Props = {
  filter: TransactionDateFilterType;
  accountId?: string;
};

const chartConfig: ChartConfig = {
  amount: {label: "Сумма"},
};

export const ExpenseInsightsReport = ({filter, accountId}: Props) => {
  const {data} = useExpenseInsightsReport({
    startDate: filter.startDate,
    endDate: filter.endDate,
    accountId,
  });

  const normalizedData = useMemo(() => {
    if (!data?.length) return [];

    const topItems = data.slice(0, 7);
    const rest = data.slice(7);
    const restAmount = rest.reduce((sum, item) => sum + item.amount, 0);
    const restCount = rest.reduce((sum, item) => sum + item.transactionsCount, 0);

    if (!rest.length) return topItems;

    return [
      ...topItems,
      {
        categoryId: "other",
        categoryName: "Остальное",
        amount: restAmount,
        share: rest.reduce((sum, item) => sum + item.share, 0),
        transactionsCount: restCount,
        averageAmount: restCount > 0 ? restAmount / restCount : 0,
        categoryColor: "#CBD5E1",
      },
    ];
  }, [data]);

  return (
    <div className="space-y-4">
      <ReportSectionHeader
        title="Разбор расходов"
        description="Показывает, какие категории забирают основную часть бюджета и насколько они регулярны."
      />

      {!normalizedData.length ? (
        <EmptyReportState title="Нет данных о расходах за выбранный период" />
      ) : (
        <>
          <Card className="rounded-[1.5rem] border-border/70 py-4 shadow-none">
            <CardContent className="px-4">
              <ChartContainer config={chartConfig} className="mx-auto h-[260px] max-w-[320px]">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie data={normalizedData} dataKey="amount" nameKey="categoryName" innerRadius={64} outerRadius={100}>
                    {normalizedData.map(item => (
                      <Cell key={item.categoryId} fill={item.categoryColor || "#94A3B8"} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {normalizedData.map(item => (
              <Card key={item.categoryId} className="gap-3 rounded-[1.5rem] border-border/70 py-4 shadow-none">
                <CardContent className="flex items-start justify-between gap-4 px-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{backgroundColor: item.categoryColor || "#94A3B8"}} />
                      <p className="truncate font-medium">{item.categoryName}</p>
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm">
                      {item.transactionsCount} операций · средний чек {formatCurrency(item.averageAmount)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <div className="font-semibold">{formatCurrency(item.amount)}</div>
                    <Badge variant="outline">{(item.share * 100).toFixed(1)}%</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
