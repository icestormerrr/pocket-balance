import {useAccounts} from "@/entities/account";

import {AccountCard} from "./ui/AccountCard/AccountCard";
import {TotalBalance} from "./ui/TotalBalance/TotalBalance";

// TODO: нет разбивки по валютам
const AccountsPage = () => {
  const {data: accounts} = useAccounts({});

  return (
    <div className="p-4 ">
      <h1 className="flex justify-between items-center text-2xl font-bold mb-2">Баланс</h1>
      <div className={"space-y-4"}>
        <TotalBalance accounts={accounts ?? []} />
        {accounts?.map(account => (
          <AccountCard account={account} />
        ))}
      </div>
    </div>
  );
};

export default AccountsPage;
