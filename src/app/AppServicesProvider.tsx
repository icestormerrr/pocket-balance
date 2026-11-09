import type {ReactNode} from "react";

import {AccountsService} from "@/core/account/service/AccountsService";
import {CategoriesService} from "@/core/category/service/CategoriesService";
import {AnalyticService} from "@/core/transaction/service/AnalyticService";
import {TransactionsService} from "@/core/transaction/service/TransactionsService";
import {AccountLocalStorageRepository} from "@/infrastructure/repository/account/AccountLocalStorageRepository";
import {CategoryLocalStorageRepository} from "@/infrastructure/repository/category/CategoryLocalStorageRepository";
import {TransactionsLocalStorageRepository} from "@/infrastructure/repository/transaction/TransactionsLocalStorageRepository";
import {AccountsServiceProvider} from "@/ui/entities/account/adapter/AccountsServiceProvider";
import {CategoriesServiceProvider} from "@/ui/entities/category/adapter/CategoriesServiceProvider";
import {TransactionServicesProvider} from "@/ui/entities/transaction/adapter/TransactionServicesProvider";

const accountsService = new AccountsService(new AccountLocalStorageRepository());
const categoriesService = new CategoriesService(new CategoryLocalStorageRepository());
const transactionsRepository = new TransactionsLocalStorageRepository();
const transactionsService = new TransactionsService(transactionsRepository, categoriesService, accountsService);
const analyticService = new AnalyticService(transactionsService, transactionsRepository, categoriesService, accountsService);

export const AppServicesProvider = ({children}: {children: ReactNode}) => (
  <AccountsServiceProvider service={accountsService}>
    <CategoriesServiceProvider service={categoriesService}>
      <TransactionServicesProvider analyticService={analyticService} transactionsService={transactionsService}>
        {children}
      </TransactionServicesProvider>
    </CategoriesServiceProvider>
  </AccountsServiceProvider>
);
