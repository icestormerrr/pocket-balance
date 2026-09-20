import {useMutation, useQueryClient} from "@tanstack/react-query";
import {accountsService} from "../service/AccountsService";

export const getDeleteAccountMutationKey = () => ["deleteAccount"] as const;

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getDeleteAccountMutationKey(),
    mutationFn: (id: string) => accountsService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({predicate: query => query.queryKey.includes("accounts")});
      void queryClient.invalidateQueries({predicate: query => query.queryKey.includes("account")});
    },
  });
};
