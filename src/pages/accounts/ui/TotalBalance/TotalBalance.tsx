import type {FC} from "react";

import type {Account} from "@/entities/account";
import {useTransactionsSummary} from "@/entities/transaction";

type Props = {
  accounts: Account[];
};

// TODO: нет разделения на валюты
export const TotalBalance: FC<Props> = ({accounts}) => {
  const {data: summaryGlobal} = useTransactionsSummary({});
  const totalStartAmount = accounts.reduce((sum, account) => sum + account.startAmount, 0);

  return (
    <p className="text-5xl font-bold tracking-tight text-foreground my-6">
      {summaryGlobal ? (totalStartAmount + summaryGlobal.income - summaryGlobal.expense).toLocaleString() : "-"}{" "}
    </p>
  );
};
