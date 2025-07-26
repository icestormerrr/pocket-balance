import type {Category} from "@/entities/category";
import {Card, CardContent} from "@/shared/ui/card";
import {type FC, memo} from "react";

type Props = {
  category: Category;
  onClick: (category: Category) => void;
};

export const CategoryCard: FC<Props> = memo(({category, onClick}) => {
  const handleClick = () => {
    onClick(category);
  };

  return (
    <Card className="w-full max-w-md rounded-xl shadow-sm" onClick={handleClick}>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full" style={{backgroundColor: category.color}} />
          <span>{category.name}</span>
        </div>
        <span className="text-sm text-muted-foreground">{category.type === "income" ? "Доход" : "Расход"}</span>
      </CardContent>
    </Card>
  );
});
