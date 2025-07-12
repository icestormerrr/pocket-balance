import {useTransactionsSummary} from "@/entities/transaction";
import {cn} from "@/shared/lib/styling.ts";
import {Card, CardContent} from "@/shared/ui/card.tsx";
import {memo} from "react";

export const TransactionsStats = memo(() => {
  const {data: summary} = useTransactionsSummary({});

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="py-2">
        <CardContent className="p-4 flex flex-col items-start">
          <span className="text-sm text-muted-foreground">Доходы</span>
          <div className={cn("text-2xl font-semibold")}>{summary?.income} ₽</div>
        </CardContent>
      </Card>

      <Card className="py-2">
        <CardContent className="p-4 flex flex-col items-start">
          <span className="text-sm text-muted-foreground">Расходы</span>
          <div className="text-2xl font-semibold text-black dark:text-white">{summary?.expense} ₽</div>
        </CardContent>
      </Card>

      <Card className="py-2">
        <CardContent className="p-4 flex flex-col items-start">
          <span className="text-sm text-muted-foreground">Текущий остаток</span>
          <div className="text-2xl font-semibold text-black dark:text-white">
            {summary ? summary?.income - summary?.expense : ""} ₽
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

TransactionsStats.displayName = "TransactionsStats";
