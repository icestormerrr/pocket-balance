import {memo, useCallback, useState} from "react";

import type {Account} from "@/entities/account";
import {Button} from "@/shared/ui/button";
import AccountFormDrawer from "@/widgets/AccountFormDrawer";

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

  return (
    <>
      <AccountFormDrawer open={open} onOpenChange={handleCloseFormDrawer} accountId={selectedAccount?.id} />

      <div className={"space-y-4"}>
        {accounts?.map(account => (
          <AccountCard account={account} onClick={handleAccountClick} />
        ))}
      </div>

      <Button size="lg" className="w-full mt-8" onClick={handleCreateButtonClick}>
        Добавить счёт
      </Button>
    </>
  );
});

AccountsList.displayName = "AccountsList";
