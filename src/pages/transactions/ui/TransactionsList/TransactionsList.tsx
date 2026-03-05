import {type Transaction, TransactionCard, type TransactionExtended} from "@/entities/transaction";
import {DateConverter} from "@/shared/lib/datetime";
import {Card, CardTitle} from "@/shared/ui/card";
import TransactionFormDrawer from "@/widgets/TransactionFormDrawer";
import {AnimatePresence, motion} from "framer-motion";
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

  const shouldAnimate = useCallback((index: number) => {
    return index < 14;
  }, []);

  return (
    <>
      <TransactionFormDrawer
        open={open}
        onOpenChange={handleCloseTransactionFormDrawer}
        transactionId={selectedTransaction?.id}
      />

      <motion.div
        layout
        variants={{
          hidden: {opacity: 0},
          show: {opacity: 1, transition: {staggerChildren: 0.07}},
        }}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-3"
      >
        <AnimatePresence mode="popLayout">
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => {
              const date = DateConverter.ISOToDate(transaction.date);
              const day = date.getDate();
              const showDayHeader = day !== lastDay;
              lastDay = day;

              const animate = shouldAnimate(index);

              return (
                <motion.div
                  key={transaction.id}
                  variants={
                    animate
                      ? {
                          hidden: {opacity: 0, y: 20, scale: 0.97},
                          show: {opacity: 1, y: 0, scale: 1},
                        }
                      : undefined
                  }
                  transition={
                    animate
                      ? {
                          type: "spring",
                          stiffness: 250,
                          damping: 20,
                        }
                      : undefined
                  }
                  whileHover={animate ? {scale: 1.02} : undefined}
                  whileTap={animate ? {scale: 0.98} : undefined}
                >
                  {showDayHeader && (
                    <motion.div
                      initial={animate ? {opacity: 0, y: 10} : undefined}
                      animate={animate ? {opacity: 1, y: 0} : undefined}
                      transition={animate ? {duration: 0.25} : undefined}
                      className="text-md font-semibold mt-3 mb-1 text-gray-600"
                    >
                      {formatDay(date)}
                    </motion.div>
                  )}

                  <TransactionCard transaction={transaction} onClick={handleTransactionClick} />
                </motion.div>
              );
            })
          ) : (
            <motion.div
              key="no-transactions"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.3}}
            >
              <Card>
                <CardTitle className="text-bold text-center">Хм, похоже нет операций за этот период...</CardTitle>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default TransactionsList;
