import {useQuery} from "@tanstack/react-query";
import type {Account} from "@/core/account/domain/Account";
import {useAccountsService} from "./AccountsServiceProvider";

export const getAccountQueryKey = (id?: string) => ["account", id] as const;

export const useAccount = (id?: string) => {
  const accountsService = useAccountsService();
  return useQuery<Account | null>({
    queryKey: getAccountQueryKey(id),
    queryFn: () => accountsService.getById(id!),
    enabled: !!id,
  });
};
