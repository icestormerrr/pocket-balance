import {useState} from "react";

import {
  TransactionsDateFilters,
  useTransactions,
  useTransactionsSummary,
  type TransactionDateFilterType,
} from "@/entities/transaction";
import {DateConverter, DateCreator} from "@/shared/lib/datetime";
import {getStatusBarHeight} from "@/shared/lib/styling";

import TransactionsList from "./ui/TransactionsList/TransactionsList";
import {TransactionsStats} from "./ui/TransactionsStats/TransactionsStats";

const TransactionsPage = () => {
  const [filter, setFilter] = useState<TransactionDateFilterType>(() => {
    const {startDate, endDate} = DateCreator.createPeriod(new Date().getFullYear(), new Date().getMonth());
    return {startDate: DateConverter.dateToISO(startDate), endDate: DateConverter.dateToISO(endDate)};
  });

  const {data: transactions} = useTransactions({startDate: filter.startDate, endDate: filter.endDate});
  const {data: summaryGlobal} = useTransactionsSummary({});
  const {data: summaryForPeriod} = useTransactionsSummary({startDate: filter.startDate, endDate: filter.endDate});

  return (
    <div className="p-4 space-y-4">
      <h1 className="flex justify-between items-center text-2xl font-bold mb-0">Операции</h1>
      <div className="mb-0 -mx-4 p-4" style={{top: getStatusBarHeight() - 2}}>
        <TransactionsDateFilters filter={filter} onFilterChange={setFilter} />
      </div>

      <TransactionsStats summaryForPeriod={summaryForPeriod} summaryGlobal={summaryGlobal} />
      {transactions && <TransactionsList transactions={transactions} />}
    </div>
  );
};

export default TransactionsPage;
