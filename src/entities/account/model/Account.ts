export type Account = {
  id: string;
  name: string;
  currencyCode: string;
  startAmount: number;
  creationDatetime: string;
};

export const CURRENCY_OPTIONS: {label: string; value: string}[] = [
  {label: "₽", value: "RUB"},
  {label: "$", value: "USD"},
  {label: "₸", value: "KZT"},
];
