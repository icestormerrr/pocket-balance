import type {CategoryType} from "@/entities/category/model/Category";

import type {Transaction} from "../model/Transaction";

export interface ITransactionsService {
  getAll(filter: {
    startDate?: string;
    endDate?: string;
    categoryType: CategoryType;
  }): Promise<(Transaction & {categoryName: string; categoryType?: CategoryType})[]>;
  getById(id: string): Promise<(Transaction & {categoryType?: CategoryType}) | null>;
  getAmountGropedByCategories(filter: {startDate?: string; endDate?: string; categoryType?: CategoryType}): Promise<
    {
      categoryId: string;
      categoryName: string;
      categoryColor?: string;
      amount: number;
    }[]
  >;
  getSummary(startDate: string, endDate: string): Promise<{income: number; expense: number}>;
  getUniqYears(): Promise<number[]>;
  create(tx: Omit<Transaction, "id">): Promise<Transaction>;
  update(id: string, tx: Partial<Omit<Transaction, "id">>): Promise<Transaction | null>;
  delete(id: string): Promise<void>;
}
