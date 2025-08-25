import type {JSX} from "react";
import {BalanceReport} from "../ui/BalanceReport/BalanceReport";
import {CategoriesReport} from "../ui/CategoriesReport/CategoriesReport";

export type ReportKey = "categories" | "balance";

export const REPORTS: Record<ReportKey, {label: string; render: () => JSX.Element}> = {
  categories: {
    label: "По категориям",
    render: () => <CategoriesReport />,
  },
  balance: {
    label: "Баланс",
    render: () => <BalanceReport />,
  },
};

// @ts-ignore
export const REPORT_OPTIONS = Object.keys(REPORTS).map(key => ({label: REPORTS[key].label, value: key}));
