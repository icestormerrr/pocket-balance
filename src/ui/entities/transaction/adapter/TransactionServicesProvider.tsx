import {createContext, type ReactNode, useContext} from "react";

import type {IAnalyticService} from "@/core/transaction/service/IAnalyticService";
import type {ITransactionsService} from "@/core/transaction/service/ITransactionsService";

type TransactionServices = {analyticService: IAnalyticService; transactionsService: ITransactionsService};

const TransactionServicesContext = createContext<TransactionServices | null>(null);

export const TransactionServicesProvider = ({
  analyticService,
  children,
  transactionsService,
}: TransactionServices & {children: ReactNode}) => (
  <TransactionServicesContext.Provider value={{analyticService, transactionsService}}>
    {children}
  </TransactionServicesContext.Provider>
);

// This hook is paired with the provider in the same adapter module.
// eslint-disable-next-line react-refresh/only-export-components
export const useTransactionServices = () => {
  const services = useContext(TransactionServicesContext);
  if (!services) {
    throw new Error("TransactionServicesProvider is required");
  }
  return services;
};
