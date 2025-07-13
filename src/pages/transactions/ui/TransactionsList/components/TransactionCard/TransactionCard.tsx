import {type FC, memo} from "react";

import type {CategoryType} from "@/entities/category";
import type {Transaction} from "@/entities/transaction";
import {DateConverter} from "@/shared/lib/datetime";
import {Badge} from "@/shared/ui/badge";
import {Card, CardContent} from "@/shared/ui/card";

type Props = {
  transaction: Transaction & {categoryName: string; categoryType?: CategoryType};
  onClick: (transaction: Transaction) => void;
};

export const TransactionCard: FC<Props> = memo(({transaction, onClick}) => {
  const {amount, date, comment, categoryName, categoryType} = transaction;

  const handleClick = () => {
    onClick(transaction);
  };

  return (
    <Card className="w-full max-w-md rounded-xl shadow-sm" onClick={handleClick}>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <p className={`text-sm font-semibold ${categoryType === "expense" ? "text-[#ef4444]" : "text-[#22c55e]"}`}>
              {amount} ₽
            </p>
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
