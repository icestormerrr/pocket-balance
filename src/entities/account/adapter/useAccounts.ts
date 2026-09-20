import {useQuery} from "@tanstack/react-query";
import type {Account} from "../model/Account";
import {accountsService} from "../service/AccountsService";
import type {AccountsFilter} from "../service/IAccountsService";

export const getAccountsQueryKey = () => ["accounts"] as const;

export const useAccounts = (filter: AccountsFilter) => {
  return useQuery<Account[]>({
    queryKey: getAccountsQueryKey(),
    queryFn: () => accountsService.getAll(filter),
  });
};
