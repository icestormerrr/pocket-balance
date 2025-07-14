import type {Transaction} from "@/entities/transaction";
import TransactionFormDrawer from "@/widgets/TransactionFormDrawer";
import {type FC, useCallback, useState} from "react";
import {TransactionCard} from "./components/TransactionCard/TransactionCard";

type Props = {
  transactions: (Transaction & {categoryName: string})[];
};

const monthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

// Форматируем день: "14 июля 2025"
function formatDay(date: Date): string {
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

const TransactionsList: FC<Props> = ({transactions}) => {
  const [open, setOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction>();

  const handleTransactionClick = useCallback((transaction: Transaction) => {
    setOpen(true);
    setSelectedTransaction(transaction);
  }, []);

  const handleCloseTransactionFormDrawer = useCallback(() => {
    setOpen(false);
    setSelectedTransaction(undefined);
  }, []);

  let lastYear = -1;
  let lastMonth = -1;
  let lastDay = -1;

  return (
    <>
      <TransactionFormDrawer
        open={open}
        onOpenChange={handleCloseTransactionFormDrawer}
        transactionId={selectedTransaction?.id}
      />

      <div className="flex flex-col gap-3">
        {transactions.map(transaction => {
          const date = new Date(transaction.date);
          const year = date.getFullYear();
          const month = date.getMonth();
          const day = date.getDate();

          // Определяем, нужно ли выводить заголовок года + месяца
          const showMonthHeader = year !== lastYear || month !== lastMonth;
          // Определяем, нужно ли выводить разделитель для дня
          const showDayHeader = day !== lastDay || showMonthHeader;

          // Обновляем "последние" значения для следующей итерации
          lastYear = year;
          lastMonth = month;
          lastDay = day;

          return (
            <div key={transaction.id}>
              {showDayHeader && <div className="text-md font-semibold mt-3 mb-1 text-gray-600">{formatDay(date)}</div>}

              <TransactionCard transaction={transaction} onClick={handleTransactionClick} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TransactionsList;
