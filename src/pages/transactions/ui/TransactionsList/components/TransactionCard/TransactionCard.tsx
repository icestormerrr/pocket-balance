import {type FC, memo} from "react";

import type {Transaction, TransactionWithCategory} from "@/entities/transaction";
import {Avatar, AvatarFallback} from "@/shared/ui/avatar";
import {Card, CardContent} from "@/shared/ui/card";

type Props = {
  transaction: TransactionWithCategory;
  onClick: (transaction: Transaction) => void;
};

export const TransactionCard: FC<Props> = memo(({transaction, onClick}) => {
  const {amount, comment, categoryName, categoryType, categoryShortName} = transaction;

  const handleClick = () => {
    onClick(transaction);
  };

  return (
    <Card className="w-full max-w-md rounded-xl shadow-sm cursor-pointer" onClick={handleClick}>
      <CardContent className="flex items-center gap-3 px-4 py-0">
        <Avatar>
          <AvatarFallback>{categoryShortName}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{categoryName}</p>
          {comment && <p className="text-xs text-muted-foreground truncate">{comment}</p>}
        </div>

        <p
          className={`text-sm font-semibold whitespace-nowrap ${
            categoryType === "expense" ? "text-[var(--negative-accent)]" : "text-[var(--positive-accent)]"
          }`}
        >
          {amount.toLocaleString("ru-RU").replace(/,/g, " ")} ₽
        </p>
      </CardContent>
    </Card>
  );
});

TransactionCard.displayName = "TransactionCard";
