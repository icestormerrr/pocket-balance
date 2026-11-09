import {createContext, type ReactNode, useContext} from "react";

import type {IAccountsService} from "@/core/account/service/IAccountsService";

const AccountsServiceContext = createContext<IAccountsService | null>(null);

export const AccountsServiceProvider = ({children, service}: {children: ReactNode; service: IAccountsService}) => (
  <AccountsServiceContext.Provider value={service}>{children}</AccountsServiceContext.Provider>
);

// This hook is paired with the provider in the same adapter module.
// eslint-disable-next-line react-refresh/only-export-components
export const useAccountsService = () => {
  const service = useContext(AccountsServiceContext);
  if (!service) {
    throw new Error("AccountsServiceProvider is required");
  }
  return service;
};
