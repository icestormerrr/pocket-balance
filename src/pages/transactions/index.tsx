import {useMemo, useState} from "react";

import {
  TransactionsDateFilters,
  useTransactions,
  useTransactionsSummary,
  type TransactionDateFilterType,
} from "@/entities/transaction";
import {DateConverter, DateCreator} from "@/shared/lib/datetime";

import {useAccounts} from "@/entities/account";
import {BadgeGroup} from "@/shared/ui/badge";
import TransactionsList from "./ui/TransactionsList/TransactionsList";
import {TransactionsStats} from "./ui/TransactionsStats/TransactionsStats";

const TransactionsPage = () => {
  const [dateFilter, setDateFilter] = useState<TransactionDateFilterType>(() => {
    const {startDate, endDate} = DateCreator.createPeriod(new Date().getFullYear(), new Date().getMonth());
    return {startDate: DateConverter.dateToISO(startDate), endDate: DateConverter.dateToISO(endDate)};
  });

  const [accountFilter, setAccountFilter] = useState<string | null>(null);
  const {data: accounts} = useAccounts({});
  const accountsOptions = useMemo(
    () => accounts?.map(acc => ({label: acc.name, value: acc.id, payload: acc})) ?? [],
    [accounts]
  );

  const {data: transactions} = useTransactions({
    startDate: dateFilter.startDate,
    endDate: dateFilter.endDate,
    accountId: accountFilter ?? undefined,
  });
  const {data: summaryGlobal} = useTransactionsSummary({accountId: accountFilter ?? undefined});
  const {data: summaryForPeriod} = useTransactionsSummary({
    startDate: dateFilter.startDate,
    endDate: dateFilter.endDate,
    accountId: accountFilter ?? undefined,
  });

  return (
    <div className="p-4 space-y-4">
      <h1 className="flex justify-between items-center text-2xl font-bold mb-0">Операции</h1>
      <div className="mb-0 -mx-4 p-4 space-y-4">
        <TransactionsDateFilters filter={dateFilter} onFilterChange={setDateFilter} />
        <BadgeGroup value={accountFilter} onChange={setAccountFilter} options={accountsOptions} />
      </div>

      <TransactionsStats summaryForPeriod={summaryForPeriod} summaryGlobal={summaryGlobal} />
      {transactions && <TransactionsList transactions={transactions} />}
    </div>
  );
};

export default TransactionsPage;
