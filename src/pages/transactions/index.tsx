import {AnimatePresence, motion} from "framer-motion";
import {ChevronDown} from "lucide-react";
import {useMemo, useState} from "react";

import {useAccounts} from "@/entities/account";
import {
  TransactionsDateFilters,
  useCategoriesReport,
  useTransactions,
  useTransactionsSummary,
  type TransactionDateFilterType,
  type TransactionsGroupedByCategory,
} from "@/entities/transaction";
import {DateConverter, DateCreator} from "@/shared/lib/datetime";
import {cn} from "@/shared/lib/styling";
import {Badge} from "@/shared/ui/badge";
import {Button} from "@/shared/ui/button";
import {SelectMobile, type Option} from "@/shared/ui/select";

import {CATEGORY_TYPE_OPTIONS, type CategoryType} from "@/entities/category";
import TransactionsList from "./ui/TransactionsList/TransactionsList";
import {TransactionsStats} from "./ui/TransactionsStats/TransactionsStats";

const TransactionsPage = () => {
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState<TransactionDateFilterType>(() => {
    const {startDate, endDate} = DateCreator.createPeriod(new Date().getFullYear(), new Date().getMonth());
    return {startDate: DateConverter.dateToISO(startDate), endDate: DateConverter.dateToISO(endDate)};
  });

  const [accountFilter, setAccountFilter] = useState<string | null>(null);
  const {data: accounts} = useAccounts({});
  const accountsOptions = useMemo(
    () => accounts?.map(acc => ({label: acc.name, value: acc.id, payload: acc})) ?? [],
    [accounts]
  );

  const [categoryTypeFilter, setCategoryTypeFilter] = useState<string | null>(null);

  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const {data: categoriesReport} = useCategoriesReport({
    startDate: dateFilter.startDate,
    endDate: dateFilter.endDate,
    accountId: accountFilter ?? undefined,
    categoryType: (categoryTypeFilter as CategoryType) ?? undefined,
  });
  const categoriesOptions = useMemo(
    () =>
      categoriesReport
        ? categoriesReport
            .map(c => ({
              label: `${c.categoryShortName ? c.categoryShortName + " - " : ""}${c.categoryName}`,
              value: c.categoryId,
              payload: c,
            }))
            .sort((a, b) => b.payload.amount - a.payload.amount)
        : [],
    [categoriesReport]
  );
  const totalCategoriesAmount = useMemo(
    () => categoriesReport?.reduce((sum, item) => sum + item.amount, 0),
    [categoriesReport]
  );

  const {data: transactions} = useTransactions({
    startDate: dateFilter.startDate,
    endDate: dateFilter.endDate,
    accountId: accountFilter ?? undefined,
    categoryId: categoryFilter ?? undefined,
    categoryType: (categoryTypeFilter as CategoryType) ?? undefined,
  });
  const {data: summaryForPeriod} = useTransactionsSummary({
    startDate: dateFilter.startDate,
    endDate: dateFilter.endDate,
    accountId: accountFilter ?? undefined,
  });

  const renderCategoryOption = (option: Option & {payload: TransactionsGroupedByCategory}) => {
    return (
      <Button
        key={option.value}
        variant="ghost"
        className={cn(
          "justify-start h-12 w-full",
          categoryFilter === option.value && "bg-muted text-primary hover:bg-muted"
        )}
      >
        {option.label}{" "}
        <Badge variant="outline">
          {option.payload.amount} ₽{" "}
          {totalCategoriesAmount ? `| ${((option.payload.amount / totalCategoriesAmount) * 100).toFixed(1)}% ` : ""}
        </Badge>
      </Button>
    );
  };

  const handleCategoryTypeFilterChange = (value: string | null) => {
    setCategoryTypeFilter(value);
    setCategoryFilter(null);
  };

  const handleClickPeriodBadge = () => {
    setShowDateFilter(old => !old);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="flex justify-between items-center text-2xl font-bold mb-0">Операции</h1>
      <div className="mb-0 -mx-4 p-4 flex gap-2 max-w-full overflow-x-auto no-scrollbar">
        <Badge onClick={handleClickPeriodBadge}>
          Период <ChevronDown size={4} />{" "}
        </Badge>

        <SelectMobile
          value={accountFilter}
          onChange={setAccountFilter}
          renderField={() => {
            const label = accountsOptions.find(opt => opt.value === accountFilter)?.label;
            return (
              <Badge variant={label ? "default" : "outline"}>
                {label ? label : "Счёт"} <ChevronDown size={4} />
              </Badge>
            );
          }}
          hideSearch
          options={accountsOptions}
          title="Выберите счёт"
        />

        <SelectMobile
          value={categoryTypeFilter}
          onChange={handleCategoryTypeFilterChange}
          renderField={() => {
            const label = CATEGORY_TYPE_OPTIONS.find(opt => opt.value === categoryTypeFilter)?.label;
            return (
              <Badge variant={label ? "default" : "outline"}>
                {label ? label : "Тип"} <ChevronDown size={4} />
              </Badge>
            );
          }}
          options={CATEGORY_TYPE_OPTIONS}
          title="Выберите тип"
        />

        {categoryTypeFilter && (
          <SelectMobile
            value={categoryFilter}
            onChange={setCategoryFilter}
            renderField={() => {
              const label = categoriesOptions.find(opt => opt.value === categoryFilter)?.label;
              return (
                <Badge variant={label ? "default" : "outline"}>
                  {label ? label : "Категория"} <ChevronDown size={4} />
                </Badge>
              );
            }}
            options={categoriesOptions}
            title="Выберите категорию"
            // @ts-expect-error ругается на payload
            renderOption={renderCategoryOption}
          />
        )}
      </div>
      <AnimatePresence initial={false}>
        {showDateFilter && (
          <motion.div
            key="date-filter"
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
            <TransactionsDateFilters filter={dateFilter} onFilterChange={setDateFilter} />
          </motion.div>
        )}
      </AnimatePresence>

      <TransactionsStats summaryForPeriod={summaryForPeriod} />
      {transactions && <TransactionsList transactions={transactions} />}
    </div>
  );
};

export default TransactionsPage;
