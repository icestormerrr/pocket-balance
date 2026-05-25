import {usePeriodComparisonReport, type TransactionDateFilterType} from "@/entities/transaction";
import {Card, CardContent, CardHeader, CardTitle} from "@/shared/ui/card";

import {DeltaBadge, EmptyReportState, ReportSectionHeader, formatCurrency} from "../shared";

type Props = {
  filter: TransactionDateFilterType;
  accountId?: string;
};

const COMPARISON_ITEMS = [
  {key: "income", label: "Доходы", tone: "positive"},
  {key: "expense", label: "Расходы", tone: "negative"},
  {key: "net", label: "Чистый результат", tone: "neutral"},
] as const;

export const PeriodComparisonReport = ({filter, accountId}: Props) => {
  const {data} = usePeriodComparisonReport({
    startDate: filter.startDate ?? "",
    endDate: filter.endDate ?? "",
    accountId,
  });

  if (!filter.startDate || !filter.endDate) {
    return <EmptyReportState title="Для сравнения выбери конкретный период" />;
  }

  return (
    <div className="space-y-4">
      <ReportSectionHeader
        title="Сравнение периодов"
        description="Показывает, лучше или хуже текущий период относительно предыдущего такой же длины."
      />

      {!data ? (
        <EmptyReportState title="Нет данных для сравнения периодов" />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            {COMPARISON_ITEMS.map(item => (
              <Card key={item.key} className="rounded-[1.5rem] border-border/70 py-4 shadow-none">
                <CardHeader className="px-4 pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
                    <DeltaBadge value={data.deltaPercent[item.key]} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1 px-4">
                  <div className="text-lg font-semibold">{formatCurrency(data.current[item.key])}</div>
                  <p className="text-muted-foreground text-sm">Было: {formatCurrency(data.previous[item.key])}</p>
                  <p className="text-muted-foreground text-xs">
                    Разница: {formatCurrency(data.delta[item.key])}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <CategoryDeltaList
              title="Больше тратишь"
              description="Категории, где расходы выросли сильнее всего"
              items={data.topGrowthCategories}
              emptyText="Нет категорий с ростом расходов"
            />
            <CategoryDeltaList
              title="Начал экономить"
              description="Категории, где расходы снизились сильнее всего"
              items={data.topReductionCategories}
              emptyText="Нет категорий со снижением расходов"
            />
          </div>
        </>
      )}
    </div>
  );
};

function CategoryDeltaList({
  title,
  description,
  items,
  emptyText,
}: {
  title: string;
  description: string;
  items: {
    categoryId: string;
    categoryName: string;
    currentAmount: number;
    previousAmount: number;
    deltaAmount: number;
    deltaPercent: number | null;
  }[];
  emptyText: string;
}) {
  return (
    <Card className="rounded-[1.5rem] border-border/70 py-4 shadow-none">
      <CardHeader className="space-y-1 px-4 pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardHeader>
      <CardContent className="space-y-3 px-4">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">{emptyText}</p>
        ) : (
          items.map(item => (
            <div key={item.categoryId} className="rounded-2xl border border-border/70 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{item.categoryName}</p>
                <DeltaBadge value={item.deltaPercent} />
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                Было {formatCurrency(item.previousAmount)} → стало {formatCurrency(item.currentAmount)}
              </p>
              <p className="mt-1 text-sm font-medium">Изменение: {formatCurrency(item.deltaAmount)}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
