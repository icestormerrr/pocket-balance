import {Link} from "@tanstack/react-router";
import {memo, type FC} from "react";

import type {Account} from "@/entities/account";
import {useTransactions, useTransactionsSummary} from "@/entities/transaction";
import {URLS} from "@/shared/const/urls";
import {Avatar, AvatarFallback} from "@/shared/ui/avatar";
import {Button} from "@/shared/ui/button";
import {Card, CardContent, CardHeader} from "@/shared/ui/card";
import {Cell} from "@/shared/ui/cell";

type Props = {
  account: Account;
};

export const AccountCard: FC<Props> = memo(({account}) => {
  const {data: summary} = useTransactionsSummary({accountId: account.id});
  const balance = summary ? account.startAmount + summary.income - summary.expense : 0;

  const {data: transactions} = useTransactions({accountId: account.id});

  return (
    <Card className="rounded-2xl shadow-md gap-6">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold">
            {balance.toLocaleString()} {account.currencyCode}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{account.name}</p>
      </CardHeader>

      {!!transactions?.length && (
        <Link to={URLS.TransactionsPage.build()}>
          <CardContent className="space-y-4">
            {transactions.slice(0, 3).map(tx => (
              <Cell>
                <Cell.LeftContent>
                  <Avatar>
                    <AvatarFallback>{tx.categoryShortName}</AvatarFallback>
                  </Avatar>
                </Cell.LeftContent>
                <Cell.Content>
                  <Cell.Content.Title>{tx.categoryName}</Cell.Content.Title>
                  <Cell.Content.Subtitle>{tx.comment}</Cell.Content.Subtitle>
                </Cell.Content>

                <Cell.RightContent>
                  <p
                    className={`text-sm font-semibold whitespace-nowrap ${
                      tx.categoryType === "expense" ? "text-[var(--negative-accent)]" : "text-[var(--positive-accent)]"
                    }`}
                  >
                    {tx.amount.toLocaleString("ru-RU").replace(/,/g, " ")}
                  </p>
                </Cell.RightContent>
              </Cell>
            ))}

            <Button className="w-full mt-2 rounded-lg" variant="outline">
              Показать все
            </Button>
          </CardContent>
        </Link>
      )}
    </Card>
  );
});

AccountCard.displayName = "AccountCard";
