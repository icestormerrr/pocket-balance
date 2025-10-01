import {type FC, memo} from "react";

import type {TransactionsSummary} from "@/entities/transaction";
import {cn} from "@/shared/lib/styling";
import {Card, CardContent} from "@/shared/ui/card";

type Props = {
  summaryForPeriod?: TransactionsSummary;
};

export const TransactionsStats: FC<Props> = memo(({summaryForPeriod}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="py-2">
        <CardContent className="p-4 flex flex-col items-start">
          <span className="text-sm text-muted-foreground">Доходы</span>
          <div className={cn("text-xl font-semibold break-all text-[var(--positive-accent)]")}>
            {summaryForPeriod?.income.toLocaleString("ru-RU").replace(/,/g, " ")} ₽
          </div>
        </CardContent>
      </Card>

      <Card className="py-2">
        <CardContent className="p-4 flex flex-col items-start">
          <span className="text-sm text-muted-foreground">Расходы</span>
          <div className="text-xl font-semibold break-all text-[var(--negative-accent)]">
            {summaryForPeriod?.expense.toLocaleString("ru-RU").replace(/,/g, " ")} ₽
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

TransactionsStats.displayName = "TransactionsStats";
