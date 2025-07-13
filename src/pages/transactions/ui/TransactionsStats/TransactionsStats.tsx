import {type FC, memo} from "react";

import {cn} from "@/shared/lib/styling";
import {Card, CardContent} from "@/shared/ui/card";

type Props = {
  summary?: {expense: number; income: number};
};

export const TransactionsStats: FC<Props> = memo(({summary}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="py-2">
        <CardContent className="p-4 flex flex-col items-start">
          <span className="text-sm text-muted-foreground">Доходы</span>
          <div className={cn("text-2xl font-semibold break-all text-[#22c55e]")}>{summary?.income} ₽</div>
        </CardContent>
      </Card>

      <Card className="py-2">
        <CardContent className="p-4 flex flex-col items-start">
          <span className="text-sm text-muted-foreground">Расходы</span>
          <div className="text-2xl font-semibold break-all text-[#ef4444]">{summary?.expense} ₽</div>
        </CardContent>
      </Card>

      <Card className="py-2">
        <CardContent className="p-4 flex flex-col items-start">
          <span className="text-sm text-muted-foreground">Остаток</span>
          <div className="text-2xl font-semibold break-all">{summary ? summary?.income - summary?.expense : ""} ₽</div>
        </CardContent>
      </Card>
    </div>
  );
});

TransactionsStats.displayName = "TransactionsStats";
