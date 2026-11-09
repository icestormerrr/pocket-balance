export type ReportKey = "cashflow" | "expense_insights" | "period_comparison" | "account_flow";

export const REPORTS: {key: ReportKey; label: string}[] = [
  {key: "cashflow", label: "Денежный поток"},
  {key: "expense_insights", label: "Разбор расходов"},
  {key: "period_comparison", label: "Сравнение периодов"},
  {key: "account_flow", label: "Активность счетов"},
];

export const REPORT_OPTIONS = REPORTS.map(report => ({label: report.label, value: report.key}));
