import {type FC, memo} from "react";

import type {TransactionsSummary} from "@/entities/transaction";
import {cn} from "@/shared/lib/styling";
import {Card, CardContent} from "@/shared/ui/card";
import {AnimatePresence, motion} from "framer-motion";

type Props = {
  transactionsSummary?: TransactionsSummary;
};

export const TransactionsStats: FC<Props> = memo(({transactionsSummary}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <AnimatePresence>
        {!!transactionsSummary?.income && (
          <motion.div
            key="income"
            layout
            initial={{opacity: 0, scale: 0.95}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.95}}
            transition={{duration: 0.25}}
          >
            <Card className="py-2">
              <CardContent className="p-4 flex flex-col items-start">
                <span className="text-sm text-muted-foreground">Доходы</span>
                <div className={cn("text-xl font-semibold break-all text-[var(--positive-accent)]")}>
                  {transactionsSummary.income.toLocaleString("ru-RU").replace(/,/g, " ")} ₽
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!!transactionsSummary?.expense && (
          <motion.div
            key="expense"
            layout
            initial={{opacity: 0, scale: 0.95}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.95}}
            transition={{duration: 0.25}}
          >
            <Card className="py-2">
              <CardContent className="p-4 flex flex-col items-start">
                <span className="text-sm text-muted-foreground">Расходы</span>
                <div className="text-xl font-semibold break-all text-[var(--negative-accent)]">
                  {transactionsSummary.expense.toLocaleString("ru-RU").replace(/,/g, " ")} ₽
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

TransactionsStats.displayName = "TransactionsStats";
