export type Transaction = {
  id: string;
  amount: number;
  categoryId: string;
  accountId: string;
  date: string;
  comment?: string;
  transferId?: string;
};

export const TRANSFER_OUT_CATEGORY_ID = "transfer_out";
export const TRANSFER_IN_CATEGORY_ID = "transfer_in";
