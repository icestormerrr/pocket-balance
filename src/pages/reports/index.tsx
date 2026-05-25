import {useMemo, useState} from "react";

import {useAccounts} from "@/entities/account";
import {TransactionsDateFilters, type TransactionDateFilterType} from "@/entities/transaction";
import {DateConverter, DateCreator} from "@/shared/lib/datetime";
import {Card, CardContent} from "@/shared/ui/card";
import {SelectMobile} from "@/shared/ui/select";

import {REPORT_OPTIONS, type ReportKey} from "./const/reports";
import {AccountFlowReport} from "./ui/AccountFlowReport/AccountFlowReport";
import {CashflowReport} from "./ui/CashflowReport/CashflowReport";
import {ExpenseInsightsReport} from "./ui/ExpenseInsightsReport/ExpenseInsightsReport";
import {PeriodComparisonReport} from "./ui/PeriodComparisonReport/PeriodComparisonReport";

const ReportsPage = () => {
  const [activeReportKey, setActiveReportKey] = useState<ReportKey>("cashflow");
  const [accountId, setAccountId] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<TransactionDateFilterType>(() => {
    const {startDate, endDate} = DateCreator.createPeriod(new Date().getFullYear(), new Date().getMonth());
    return {startDate: DateConverter.dateToISO(startDate), endDate: DateConverter.dateToISO(endDate)};
  });

  const {data: accounts} = useAccounts({});
  const accountOptions = useMemo(() => accounts?.map(account => ({label: account.name, value: account.id})) ?? [], [accounts]);
  const shouldShowAccountFilter = activeReportKey !== "account_flow";

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-[-0.04em]">Отчёты</h1>
        <p className="text-muted-foreground text-sm">Новый набор аналитики для быстрых решений по расходам и доходам.</p>
      </div>

      <Card className="rounded-[1.75rem] border-border/70 py-4 shadow-none">
        <CardContent className="space-y-4 px-4">
          <SelectMobile
            title="Выберите отчёт"
            placeholder="Выберите отчёт"
            value={activeReportKey}
            onChange={value => setActiveReportKey((value ?? "cashflow") as ReportKey)}
            options={REPORT_OPTIONS}
            hideSearch
          />

          {shouldShowAccountFilter && (
            <SelectMobile
              title="Выберите счёт"
              placeholder="Все счета"
              value={accountId}
              onChange={value => setAccountId(value)}
              options={accountOptions}
              hideSearch
            />
          )}

          <TransactionsDateFilters filter={dateFilter} onFilterChange={setDateFilter} />
        </CardContent>
      </Card>

      {activeReportKey === "cashflow" && <CashflowReport filter={dateFilter} accountId={accountId ?? undefined} />}
      {activeReportKey === "expense_insights" && (
        <ExpenseInsightsReport filter={dateFilter} accountId={accountId ?? undefined} />
      )}
      {activeReportKey === "period_comparison" && (
        <PeriodComparisonReport filter={dateFilter} accountId={accountId ?? undefined} />
      )}
      {activeReportKey === "account_flow" && <AccountFlowReport filter={dateFilter} />}
    </div>
  );
};

export default ReportsPage;
