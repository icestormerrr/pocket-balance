import type {Category} from "@/entities/category";
import {CategoryCard} from "@/pages/categories/ui/CategoriesList/components/CategoryCard/CategoryCard";
import {type FC} from "react";

type Props = {
  categories: Category[];
  onCategoryClick: (category: Category) => void;
};

export const CategoriesList: FC<Props> = ({categories, onCategoryClick}) => {
  return (
    <div className="flex flex-col gap-2">
      {categories?.map(category => (
        <CategoryCard category={category} onClick={onCategoryClick} key={category.id} />
      ))}
    </div>
  );
};
