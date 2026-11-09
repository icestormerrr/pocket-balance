import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {Account} from "@/core/account/domain/Account";
import {useAccountsService} from "./AccountsServiceProvider";

export const getCreateAccountMutationKey = () => ["createAccount"] as const;

export const useCreateAccount = () => {
  const accountsService = useAccountsService();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getCreateAccountMutationKey(),
    mutationFn: (data: Omit<Account, "id" | "creationDatetime">) => accountsService.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({predicate: query => query.queryKey.includes("accounts")});
      void queryClient.invalidateQueries({predicate: query => query.queryKey.includes("account")});
    },
  });
};
