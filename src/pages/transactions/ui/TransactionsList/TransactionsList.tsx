import {type FC, useCallback, useState} from "react";

import type {Transaction} from "@/entities/transaction";
import TransactionFormDrawer from "@/widgets/TransactionFormDrawer";

import {TransactionCard} from "./components/TransactionCard/TransactionCard";

type Props = {
  transactions: (Transaction & {categoryName: string})[];
};

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

  return (
    <>
      <TransactionFormDrawer
        open={open}
        onOpenChange={handleCloseTransactionFormDrawer}
        transactionId={selectedTransaction?.id}
      />

      <div className="flex flex-col gap-3">
        {transactions?.map(transaction => (
          <TransactionCard transaction={transaction} onClick={handleTransactionClick} />
        ))}
      </div>
    </>
  );
};

export default TransactionsList;
