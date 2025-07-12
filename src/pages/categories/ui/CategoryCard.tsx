import type {Category} from "@/entities/category";
import {Card, CardContent} from "@/shared/ui/card";
import {memo} from "react";

export const CategoryCard = memo(({category}: {category: Category}) => {
  return (
    <Card className="mb-2 cursor-pointer">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full" style={{backgroundColor: category.color}} />
          <span>{category.name}</span>
        </div>
        <span className="text-sm text-muted-foreground">{category.type === "income" ? "Доход" : "Расход"}</span>
      </CardContent>
    </Card>
  );
});
