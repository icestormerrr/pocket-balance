import {type FC, memo} from "react";

import type {Transaction, TransactionWithCategory} from "@/entities/transaction";
import {Badge} from "@/shared/ui/badge";
import {Card, CardContent} from "@/shared/ui/card";

type Props = {
  transaction: TransactionWithCategory;
  onClick: (transaction: Transaction) => void;
};

export const TransactionCard: FC<Props> = memo(({transaction, onClick}) => {
  const {amount, comment, categoryName, categoryType} = transaction;

  const handleClick = () => {
    onClick(transaction);
  };

  return (
    <Card className="w-full max-w-md rounded-xl shadow-sm" onClick={handleClick}>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center m-0">
          <p className={`text-sm font-semibold ${categoryType === "expense" ? "text-[#ef4444]" : "text-[#22c55e]"}`}>
            {amount.toLocaleString("ru-RU").replace(/,/g, " ")} ₽
          </p>
          <Badge variant="outline" className="text-xs">
            {categoryName}
          </Badge>
        </div>
        {comment && <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{comment}</p>}
      </CardContent>
    </Card>
  );
});

TransactionCard.displayName = "TransactionCard";
