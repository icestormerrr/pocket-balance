import {Minus, TrendingDown, TrendingUp} from "lucide-react";
import {memo, type FC} from "react";

import {calculateBalance} from "@/core/account/domain/balance";
import type {Account} from "@/ui/entities/account";
import {useTransactionsSummary} from "@/ui/entities/transaction";
import {getMonthToDatePeriod} from "@/ui/pages/accounts/model/month-to-date-period";
import {cn} from "@/ui/shared/lib/styling";
import {Card, CardContent, CardHeader} from "@/ui/shared/ui/card";

type Props = {
  account: Account;
  onClick?: (account: Account) => void;
};

const changeFormatter = new Intl.NumberFormat("ru-RU", {maximumFractionDigits: 2, signDisplay: "exceptZero"});

export const AccountCard: FC<Props> = memo(({account, onClick}) => {
  const {data: summary} = useTransactionsSummary({accountId: account.id});
  const balance = summary ? calculateBalance({openingBalance: account.startAmount, ...summary}) : undefined;
  const {data: monthSummary, isError} = useTransactionsSummary({
    accountId: account.id,
    ...getMonthToDatePeriod(new Date()),
  });
  const change = monthSummary ? calculateBalance(monthSummary) : undefined;
  const ChangeIcon = change === undefined || change === 0 ? Minus : change > 0 ? TrendingUp : TrendingDown;
  const changeLabel =
    change === undefined
      ? isError
        ? "Недоступно"
        : "…"
      : change === 0
        ? "Без изменений"
        : `${changeFormatter.format(change)} ${account.currencyCode}`;

  const handleClick = () => {
    onClick?.(account);
  };

  return (
    <Card onClick={handleClick}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold">
            {balance === undefined ? "…" : `${balance.toLocaleString("ru-RU")} ${account.currencyCode}`}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{account.name}</p>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between gap-4 border-t pt-4">
          <div>
            <p className="text-sm">Изменение баланса</p>
            <p className="text-xs text-muted-foreground">С начала месяца</p>
          </div>
          <p
            role="status"
            className={cn(
              "flex shrink-0 items-center gap-1.5 text-sm font-semibold",
              change === undefined || change === 0
                ? "text-muted-foreground"
                : change > 0
                  ? "text-[var(--positive-accent)]"
                  : "text-[var(--negative-accent)]"
            )}
          >
            {change !== undefined && <ChangeIcon aria-hidden="true" className="size-4" />}
            <span>{changeLabel}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
});

AccountCard.displayName = "AccountCard";
