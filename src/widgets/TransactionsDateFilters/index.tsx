import {useTransactionsYears} from "@/entities/transaction";
import {months} from "@/shared/lib/datetime";
import {BadgeGroup} from "@/shared/ui/badge";
import {useMemo} from "react";

export type TransactionDateFilterType = {
  startDate?: string | undefined;
  endDate?: string | undefined;
};

interface TransactionsFiltersProps {
  filter?: TransactionDateFilterType;
  onFilterChange: (filter: TransactionDateFilterType) => void;
}

export function TransactionsDateFilters({filter, onFilterChange}: TransactionsFiltersProps) {
  const {data: years} = useTransactionsYears();

  const {selectedYear, selectedMonth} = useMemo(() => {
    if (!filter?.startDate || !filter?.endDate) {
      return {selectedYear: undefined, selectedMonth: undefined};
    }

    const start = new Date(filter.startDate);
    const end = new Date(filter.endDate);

    const year = start.getUTCFullYear();
    const sameYear = year === end.getUTCFullYear();
    const sameMonth = start.getUTCMonth() === end.getUTCMonth();

    return {
      selectedYear: sameYear ? year : undefined,
      selectedMonth: sameYear && sameMonth ? start.getUTCMonth() : undefined,
    };
  }, [filter]);

  const handleYearChange = (year: number | null) => {
    if (!year) {
      onFilterChange({startDate: undefined, endDate: undefined});
      return;
    }

    const start = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

    onFilterChange({
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });
  };

  const handleMonthChange = (month: number | null) => {
    if (selectedYear === undefined || month === null) return;

    const start = new Date(Date.UTC(selectedYear, month, 1, 0, 0, 0));
    const end = new Date(Date.UTC(selectedYear, month + 1, 0, 23, 59, 59, 999));

    onFilterChange({
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });
  };

  return (
    <div className="flex flex-col gap-2 mt-5">
      <BadgeGroup
        value={selectedYear}
        onChange={v => handleYearChange(v ?? null)}
        options={years?.map(y => ({label: y.toString(), value: y})) ?? []}
      />
      <BadgeGroup value={selectedMonth} onChange={v => handleMonthChange(v ?? null)} options={months} />
    </div>
  );
}
