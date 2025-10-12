import {useAccounts} from "@/entities/account";

import {AccountsList} from "@/pages/accounts/ui/AccountsList/AccountsList";
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
      {accounts && <AccountsList accounts={accounts} />}
    </div>
  );
};

export default AccountsPage;
