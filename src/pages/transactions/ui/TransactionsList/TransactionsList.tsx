import {type Transaction, TransactionCard, type TransactionExtended} from "@/entities/transaction";
import {DateConverter} from "@/shared/lib/datetime";
import {Card, CardTitle} from "@/shared/ui/card";
import TransactionFormDrawer from "@/widgets/TransactionFormDrawer";
import {type FC, useCallback, useState} from "react";

type Props = {
  transactions: TransactionExtended[];
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

  let lastDay = -1;

  return (
    <>
      <TransactionFormDrawer
        open={open}
        onOpenChange={handleCloseTransactionFormDrawer}
        transactionId={selectedTransaction?.id}
      />

      <div className="flex flex-col gap-3">
        {transactions.length > 0 ? (
          transactions.map(transaction => {
            const date = DateConverter.ISOToDate(transaction.date);
            const day = date.getDate();

            const showDayHeader = day !== lastDay;

            lastDay = day;

            return (
              <div key={transaction.id}>
                {showDayHeader && (
                  <div className="text-md font-semibold mt-3 mb-1 text-gray-600">{formatDay(date)}</div>
                )}

                <TransactionCard transaction={transaction} onClick={handleTransactionClick} />
              </div>
            );
          })
        ) : (
          <Card>
            <CardTitle className="text-bold text-center">Хм, похоже нет операций за этот период...</CardTitle>
          </Card>
        )}
      </div>
    </>
  );
};

export default TransactionsList;
