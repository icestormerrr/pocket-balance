import {useState} from "react";

import {useTransactions} from "@/entities/transaction";
import TransactionsDateFilters, {type TransactionDateFilterType} from "@/widgets/TransactionsDateFilters";

import TransactionsList from "./ui/TransactionsList/TransactionsList.tsx";
import {TransactionsStats} from "./ui/TransactionsStats/TransactionsStats.tsx";

const TransactionsPage = () => {
  const [filter, setFilter] = useState<TransactionDateFilterType>({});

  const {data: transactions} = useTransactions({startDate: filter.startDate, endDate: filter.endDate});

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Операции</h1>
      </div>

      <TransactionsDateFilters filter={filter} onFilterChange={setFilter} />

      <TransactionsStats />

      {transactions && <TransactionsList transactions={transactions} />}
    </div>
  );
};

export default TransactionsPage;
