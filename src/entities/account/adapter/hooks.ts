import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import type {Account} from "../model/Account";
import {accountsService} from "../service/AccountsService";
import type {AccountsFilter} from "../service/IAccountsService";

export const useAccounts = (filter: AccountsFilter) => {
  return useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: () => accountsService.getAll(filter),
  });
};

export const useAccount = (id?: string) => {
  return useQuery<Account | null>({
    queryKey: ["account", id],
    queryFn: () => accountsService.getById(id!),
    enabled: !!id,
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Account, "id" | "creationDatetime">) => accountsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("accounts")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("account")});
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, data}: {id: string; data: Partial<Omit<Account, "id">>}) => accountsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("accounts")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("account")});
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("accounts")});
      queryClient.invalidateQueries({predicate: query => query.queryKey.includes("account")});
    },
  });
};
