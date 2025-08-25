import {useState} from "react";

import {useBalanceReport} from "@/entities/transaction";
import {DateConverter, DateCreator} from "@/shared/lib/datetime";
import {SegmentInput} from "@/shared/ui/tabs";
import TransactionsDateFilters, {type TransactionDateFilterType} from "@/widgets/TransactionsDateFilters";

import {BalanceLineChart} from "./components/BalanceLineChart/BalanceLineChart";

type BalanceGranularity = "year" | "month" | "day";

const GRANULARITY_OPTIONS: {label: string; value: BalanceGranularity}[] = [
  {label: "Годы", value: "year"},
  {label: "Месяцы", value: "month"},
  {label: "Дни", value: "day"},
];

export const BalanceReport = () => {
  const [granularity, setGranularity] = useState<BalanceGranularity>("month");

  const [dateFilter, setDateFilter] = useState<TransactionDateFilterType>(() => {
    const {startDate, endDate} = DateCreator.createPeriod(new Date().getFullYear());
    return {startDate: DateConverter.dateToISO(startDate), endDate: DateConverter.dateToISO(endDate)};
  });

  const {data} = useBalanceReport({
    startDate: dateFilter.startDate,
    endDate: dateFilter.endDate,
    granularity,
  });

  const handleGranularityChange = (value: BalanceGranularity) => {
    if (value === "year") {
      setDateFilter({startDate: undefined, endDate: undefined});
    } else if (value === "month") {
      const {startDate, endDate} = DateCreator.createPeriod(new Date().getFullYear());
      setDateFilter({startDate: DateConverter.dateToISO(startDate), endDate: DateConverter.dateToISO(endDate)});
    } else {
      const {startDate, endDate} = DateCreator.createPeriod(new Date().getFullYear(), new Date().getMonth());
      setDateFilter({startDate: DateConverter.dateToISO(startDate), endDate: DateConverter.dateToISO(endDate)});
    }

    setGranularity(value);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Баланс</h1>

        <SegmentInput
          value={granularity}
          // @ts-expect-error BalanceGranularity не удовлетворяет string
          onChange={handleGranularityChange}
          options={GRANULARITY_OPTIONS}
        />
      </div>

      {(granularity === "day" || granularity === "month") && (
        <TransactionsDateFilters
          filter={dateFilter}
          onFilterChange={setDateFilter}
          showMonths={granularity === "day"}
        />
      )}

      <BalanceLineChart data={data} />
    </>
  );
};
