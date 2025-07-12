export type Transaction = {
  id: string;
  amount: number;
  categoryId: string;
  accountId?: string;
  date: string;
  comment?: string;
};
