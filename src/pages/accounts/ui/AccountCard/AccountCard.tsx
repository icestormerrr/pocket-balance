import {memo, type FC} from "react";

import type {Account} from "@/entities/account";
import {useTransactionsSummary} from "@/entities/transaction";
import {Card, CardTitle} from "@/shared/ui/card";
import {Cell} from "@/shared/ui/cell";

type Props = {
  account: Account;
};

export const AccountCard: FC<Props> = memo(({account}) => {
  const {data: summary} = useTransactionsSummary({accountId: account.id});

  return (
    <Card className="w-full gap-2 p-4">
      <Cell>
        <Cell.Content>
          <CardTitle className="text-base font-medium text-muted-foreground">{account.name}</CardTitle>
        </Cell.Content>
        <Cell.RightContent>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {summary ? (account.startAmount + summary.income - summary.expense).toLocaleString() : "-"}{" "}
            <span className="text-muted-foreground text-lg font-normal">{account.currencyCode}</span>
          </p>
        </Cell.RightContent>
      </Cell>
    </Card>
  );
});

AccountCard.displayName = "AccountCard";
