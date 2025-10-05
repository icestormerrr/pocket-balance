import {useAccounts} from "@/entities/account";

import {AccountCard} from "./ui/AccountCard/AccountCard";
import {TotalBalance} from "./ui/TotalBalance/TotalBalance";

// TODO: нет разбивки по валютам
const AccountsPage = () => {
  const {data: accounts} = useAccounts({});

  return (
    <div className="p-4">
      <div className={"mt-30 mb-15 text-center"}>
        <h1 className="text-2xl font-semibold mb-1">Баланс</h1>
        <TotalBalance accounts={accounts ?? []} />
      </div>
      <div className={"space-y-4"}>
        {accounts?.map(account => (
          <AccountCard account={account} />
        ))}
      </div>
    </div>
  );
};

export default AccountsPage;
