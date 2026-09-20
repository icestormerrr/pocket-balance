import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {Account} from "../model/Account";
import {accountsService} from "../service/AccountsService";

export const getCreateAccountMutationKey = () => ["createAccount"] as const;

export const useCreateAccount = () => {
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
