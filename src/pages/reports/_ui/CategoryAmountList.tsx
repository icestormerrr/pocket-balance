import {Badge} from "@/shared/ui/badge";
import {ScrollArea} from "@/shared/ui/scroll-area";
import type {CategoryAmountChartData} from "../_model/useAmountByCategoriesChart";

type Props = {
  chartData: CategoryAmountChartData[];
};

export const CategoryAmountList = ({chartData}: Props) => {
  return (
    <div className="space-y-4 mt-2">
      <ScrollArea className="h-[300px] w-full rounded-md border p-2">
        <div className="flex flex-col gap-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{backgroundColor: item.fill}} />
                <span className="text-sm font-medium">{item.categoryName}</span>
              </div>
              <Badge variant="outline">{item.amount} ₽</Badge>
            </div>
          ))}
          {chartData.length === 0 && <div className="text-sm text-muted-foreground text-center py-8">Нет данных</div>}
        </div>
      </ScrollArea>
    </div>
  );
};
