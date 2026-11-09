import {createContext, type ReactNode, useContext} from "react";

import type {ICategoriesService} from "@/core/category/service/ICategoriesService";

const CategoriesServiceContext = createContext<ICategoriesService | null>(null);

export const CategoriesServiceProvider = ({children, service}: {children: ReactNode; service: ICategoriesService}) => (
  <CategoriesServiceContext.Provider value={service}>{children}</CategoriesServiceContext.Provider>
);

// This hook is paired with the provider in the same adapter module.
// eslint-disable-next-line react-refresh/only-export-components
export const useCategoriesService = () => {
  const service = useContext(CategoriesServiceContext);
  if (!service) {
    throw new Error("CategoriesServiceProvider is required");
  }
  return service;
};
