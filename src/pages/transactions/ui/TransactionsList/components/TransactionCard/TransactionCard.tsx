import {memo} from "react";

import {DateConverter} from "@/shared/lib/datetime";
import {Badge} from "@/shared/ui/badge";
import {Card, CardContent} from "@/shared/ui/card";

type Props = {
  id: string;
  amount: number;
  date?: string;
  comment?: string;
  categoryName: string;
};

export const TransactionCard = memo(({amount, date, comment, categoryName}: Props) => {
  return (
    <Card className="w-full max-w-md rounded-xl shadow-sm">
      <CardContent className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold">{amount} ₽</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {date ? DateConverter.ISOToFormattedString(date, "MMM DD") : ""}
          </p>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{comment}</p>
        <Badge variant="outline" className="text-xs">
          {categoryName}
        </Badge>
      </CardContent>
    </Card>
  );
});

TransactionCard.displayName = "TransactionCard";
