import {useCategoryStore} from "@/entities/category";
import {useOperationStore} from "@/entities/operation";
import {cn} from "@/shared/lib/styling";
import {Card, CardContent} from "@/shared/ui/card";
import {useMemo} from "react";

export function OperationsStats() {
  const operations = useOperationStore(state => state.operations);
  const categories = useCategoryStore(state => state.categories);
  const totalIncomes = useMemo(() => {
    return operations.filter(op => categories[op.categoryId].type === "income").reduce((acc, op) => acc + op.amount, 0);
  }, [operations, categories]);

  const totalExpenses = useMemo(() => {
    return operations
      .filter(op => categories[op.categoryId].type === "expense")
      .reduce((acc, op) => acc + op.amount, 0);
  }, [operations, categories]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="py-2">
        <CardContent className="p-4 flex flex-col items-start">
          <span className="text-sm text-muted-foreground">Доходы</span>
          <div className={cn("text-2xl font-semibold")}>{totalIncomes} ₽</div>
        </CardContent>
      </Card>

      <Card className="py-2">
        <CardContent className="p-4 flex flex-col items-start">
          <span className="text-sm text-muted-foreground">Расходы</span>
          <div className="text-2xl font-semibold text-black dark:text-white">{totalExpenses} ₽</div>
        </CardContent>
      </Card>

      <Card className="py-2">
        <CardContent className="p-4 flex flex-col items-start">
          <span className="text-sm text-muted-foreground">Текущий остаток</span>
          <div className="text-2xl font-semibold text-black dark:text-white">{totalIncomes - totalExpenses} ₽</div>
        </CardContent>
      </Card>
    </div>
  );
}
