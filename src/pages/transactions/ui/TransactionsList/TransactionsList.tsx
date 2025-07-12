import {type FC, useState} from "react";

import type {Transaction} from "@/entities/transaction";
import TransactionFormDrawer from "@/widgets/TransactionFormDrawer";

import {TransactionCard} from "./components/TransactionCard/TransactionCard.tsx";

type Props = {
  transactions: (Transaction & {categoryName: string})[];
};

const TransactionsList: FC<Props> = ({transactions}) => {
  const [open, setOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction>();

  const handleTransactionClick = (transaction: Transaction) => {
    setOpen(true);
    setSelectedTransaction(transaction);
  };

  return (
    <>
      <TransactionFormDrawer open={open} onOpenChange={setOpen} transactionId={selectedTransaction?.id} />

      <div className="overflow-y-auto pr-2">
        <div className="flex flex-col gap-3">
          {transactions?.map(transaction => (
            <div onClick={() => handleTransactionClick(transaction)} key={transaction.id}>
              <TransactionCard
                id={transaction.id}
                amount={transaction.amount}
                date={transaction.date}
                comment={transaction.comment}
                categoryName={transaction.categoryName}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TransactionsList;
