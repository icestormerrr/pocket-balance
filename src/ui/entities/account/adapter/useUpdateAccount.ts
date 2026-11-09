import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {Account} from "@/core/account/domain/Account";
import {useAccountsService} from "./AccountsServiceProvider";

export const getUpdateAccountMutationKey = () => ["updateAccount"] as const;

export const useUpdateAccount = () => {
  const accountsService = useAccountsService();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getUpdateAccountMutationKey(),
    mutationFn: ({id, data}: {id: string; data: Partial<Omit<Account, "id">>}) => accountsService.update(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({predicate: query => query.queryKey.includes("accounts")});
      void queryClient.invalidateQueries({predicate: query => query.queryKey.includes("account")});
    },
  });
};
