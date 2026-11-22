type BalanceInput = {
  openingBalance?: number;
  income: number;
  expense: number;
};

export function calculateBalance({openingBalance = 0, income, expense}: BalanceInput): number {
  return openingBalance + income - expense;
}
