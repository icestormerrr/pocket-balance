import {useTransactionsYears} from "@/entities/transaction";
import {DateConverter, DateCreator, months} from "@/shared/lib/datetime";
import {BadgeGroup} from "@/shared/ui/badge";
import {AnimatePresence, motion} from "framer-motion";
import {useMemo} from "react";

export type TransactionDateFilterType = {
  startDate?: string | undefined;
  endDate?: string | undefined;
};

interface TransactionsFiltersProps {
  filter?: TransactionDateFilterType;
  onFilterChange: (filter: TransactionDateFilterType) => void;
  showMonths?: boolean;
}

const TransactionsDateFilters = ({filter, onFilterChange, showMonths = true}: TransactionsFiltersProps) => {
  const {data: years} = useTransactionsYears();

  const {selectedYear, selectedMonth} = useMemo(() => {
    if (!filter?.startDate || !filter?.endDate) {
      return {selectedYear: undefined, selectedMonth: undefined};
    }

    const start = new Date(filter.startDate);
    const end = new Date(filter.endDate);

    const year = start.getFullYear();
    const sameYear = year === end.getFullYear();
    const sameMonth = start.getMonth() === end.getMonth();

    return {
      selectedYear: sameYear ? year : undefined,
      selectedMonth: sameYear && sameMonth ? start.getMonth() : undefined,
    };
  }, [filter]);

  const handleYearChange = (year: number | null) => {
    if (year === null) {
      return;
    }

    const {startDate, endDate} = DateCreator.createPeriod(year);

    onFilterChange({
      startDate: DateConverter.dateToISO(startDate),
      endDate: DateConverter.dateToISO(endDate),
    });
  };

  const handleMonthChange = (month: number | null) => {
    if (selectedYear === undefined || month === null) {
      if (selectedYear !== undefined) {
        handleYearChange(selectedYear);
      } else {
        onFilterChange({});
      }
      return;
    }

    const {startDate, endDate} = DateCreator.createPeriod(selectedYear, month);

    onFilterChange({
      startDate: DateConverter.dateToISO(startDate),
      endDate: DateConverter.dateToISO(endDate),
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <BadgeGroup
        value={selectedYear}
        onChange={v => handleYearChange(v ?? null)}
        options={years?.map(y => ({label: y.toString(), value: y})) ?? []}
      />
      <AnimatePresence initial={false}>
        {showMonths && selectedYear !== undefined && (
          <motion.div
            key="month-filter"
            variants={{
              initial: {opacity: 0, height: 0},
              animate: {opacity: 1, height: "auto"},
              exit: {opacity: 0, height: 0},
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{duration: 0.2}}
            style={{overflow: "hidden"}}
          >
            <BadgeGroup value={selectedMonth} onChange={v => handleMonthChange(v ?? null)} options={months} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionsDateFilters;
