import {useQuery} from "@tanstack/react-query";
import type {Account} from "../model/Account";
import {accountsService} from "../service/AccountsService";

export const getAccountQueryKey = (id?: string) => ["account", id] as const;

export const useAccount = (id?: string) => {
  return useQuery<Account | null>({
    queryKey: getAccountQueryKey(id),
    queryFn: () => accountsService.getById(id!),
    enabled: !!id,
  });
};
