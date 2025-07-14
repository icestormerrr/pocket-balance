import {Badge} from "@/shared/ui/badge";
import {ScrollArea} from "@/shared/ui/scroll-area";
import {useMemo} from "react";

type Props = {
  chartData?: {
    categoryId: string;
    categoryName: string;
    fill?: string;
    amount: number;
  }[];
};

export const CategoryAmountListReport = ({chartData}: Props) => {
  const totalAmount = useMemo(() => chartData?.reduce((sum, item) => sum + item.amount, 0), [chartData]);
  return (
    <div className="space-y-4 mt-2">
      <ScrollArea className="h-[290px] w-full rounded-md border p-2">
        <div className="flex flex-col gap-2">
          {chartData?.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{backgroundColor: item.fill}} />
                <span className="text-sm font-medium">{item.categoryName}</span>
              </div>
              <div>
                <Badge variant="outline">
                  {item.amount} ₽ {totalAmount ? `| ${((item.amount / totalAmount) * 100).toFixed(1)}% ` : ""}
                </Badge>
              </div>
            </div>
          ))}
          {chartData?.length === 0 && <div className="text-sm text-muted-foreground text-center py-8">Нет данных</div>}
        </div>
      </ScrollArea>
    </div>
  );
};
