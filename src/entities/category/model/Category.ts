export type CategoryType = "expense" | "income";

export type Category = {
  id: string;
  name: string;
  type: CategoryType;
  creationDatetime: string;
  color: string;
};

export const CATEGORY_TYPE_OPTIONS: {label: string; value: CategoryType}[] = [
  {label: "Расход", value: "expense"},
  {label: "Доход", value: "income"},
];
