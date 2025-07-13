import {useState} from "react";

import {useTransactions, useTransactionsSummary} from "@/entities/transaction";
import TransactionsDateFilters, {type TransactionDateFilterType} from "@/widgets/TransactionsDateFilters";

import {DateConverter, DateCreator} from "@/shared/lib/datetime";
import TransactionsList from "./ui/TransactionsList/TransactionsList";
import {TransactionsStats} from "./ui/TransactionsStats/TransactionsStats";

const TransactionsPage = () => {
  const [filter, setFilter] = useState<TransactionDateFilterType>(() => {
    const {startDate, endDate} = DateCreator.createPeriod(new Date().getFullYear());
    return {startDate: DateConverter.dateToISO(startDate), endDate: DateConverter.dateToISO(endDate)};
  });

  const {data: transactions} = useTransactions({startDate: filter.startDate, endDate: filter.endDate});
  const {data: summary} = useTransactionsSummary({startDate: filter.startDate, endDate: filter.endDate});

  return (
    <div className="px-4 pb-4 space-y-4 max-w-md mx-auto">
      <h1 className="flex justify-between items-center text-2xl font-bold">Операции</h1>

      <TransactionsDateFilters filter={filter} onFilterChange={setFilter} />

      <TransactionsStats summary={summary} />
      {transactions && <TransactionsList transactions={transactions} />}
    </div>
  );
};

export default TransactionsPage;
