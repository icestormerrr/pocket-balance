import {useQuery} from "@tanstack/react-query";
import type {Account} from "@/core/account/domain/Account";
import type {AccountsFilter} from "@/core/account/service/IAccountsService";
import {useAccountsService} from "./AccountsServiceProvider";

export const getAccountsQueryKey = () => ["accounts"] as const;

export const useAccounts = (filter: AccountsFilter) => {
  const accountsService = useAccountsService();
  return useQuery<Account[]>({
    queryKey: getAccountsQueryKey(),
    queryFn: () => accountsService.getAll(filter),
  });
};
