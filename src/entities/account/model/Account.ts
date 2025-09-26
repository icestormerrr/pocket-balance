export type Currency = "RUB" | "USD" | "KZT";

export type Account = {
  id: string;
  name: string;
  currency: Currency;
  creationDatetime: string;
};

export const CURRENCY_OPTIONS: {label: string; value: Currency}[] = [
  {label: "₽", value: "RUB"},
  {label: "$", value: "USD"},
  {label: "₸", value: "KZT"},
];
