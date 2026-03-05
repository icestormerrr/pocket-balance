import type {Account} from "@/entities/account";
import {Button} from "@/shared/ui/button";
import AccountFormDrawer from "@/widgets/AccountFormDrawer";
import {AnimatePresence, motion} from "framer-motion";
import {memo, useCallback, useState} from "react";
import {AccountCard} from "./components/AccountCard/AccountCard";

type Props = {
  accounts: Account[];
};

export const AccountsList = memo(({accounts}: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account>();

  const handleAccountClick = useCallback((account: Account) => {
    setOpen(true);
    setSelectedAccount(account);
  }, []);

  const handleCreateButtonClick = useCallback(() => {
    setOpen(true);
    setSelectedAccount(undefined);
  }, []);

  const handleCloseFormDrawer = useCallback(() => {
    setOpen(false);
    setSelectedAccount(undefined);
  }, []);

  const shouldAnimate = useCallback((index: number) => {
    return index < 14;
  }, []);

  return (
    <>
      <AccountFormDrawer open={open} onOpenChange={handleCloseFormDrawer} accountId={selectedAccount?.id} />

      <motion.div
        layout
        variants={{
          hidden: {opacity: 0},
          show: {opacity: 1, transition: {staggerChildren: 0.07}},
        }}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4"
      >
        <AnimatePresence mode="popLayout">
          {accounts.length > 0 ? (
            accounts.map((account, index) => {
              const animate = shouldAnimate(index);

              return (
                <motion.div
                  key={account.id}
                  layout
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
                  <AccountCard account={account} onClick={handleAccountClick} />
                </motion.div>
              );
            })
          ) : (
            <motion.div
              key="no-accounts"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.3}}
              className="text-center py-8 text-gray-500"
            >
              Создайте свой первый счёт
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div layout initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.3}}>
          <Button size="lg" className="w-full mt-4" onClick={handleCreateButtonClick}>
            Добавить счёт
          </Button>
        </motion.div>
      </motion.div>
    </>
  );
});

AccountsList.displayName = "AccountsList";
