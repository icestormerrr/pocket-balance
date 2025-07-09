export type Operation = {
  id: string;
  amount: number;
  categoryId: string;
  accountId?: string;
  date: string;
  comment?: string;
};
