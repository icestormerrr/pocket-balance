import type {FC} from "react";

import type {Account} from "@/entities/account";
import {useTransactionsSummary} from "@/entities/transaction";

type Props = {
  accounts: Account[];
};

export const TotalBalance: FC<Props> = ({accounts}) => {
  const {data: summaryGlobal} = useTransactionsSummary({});
  const totalStartAmount = accounts.reduce((sum, account) => sum + account.startAmount, 0);

  return (
    <p className="text-3xl font-bold tracking-tight text-foreground">
      {summaryGlobal ? (totalStartAmount + summaryGlobal.income - summaryGlobal.expense).toLocaleString() : "-"}{" "}
    </p>
  );
};
