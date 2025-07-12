import {useState} from "react";

import {type Category, useCategories} from "@/entities/category";
import {Button} from "@/shared/ui/button";
import {ScrollArea} from "@/shared/ui/scroll-area";
import CategoryFormDrawer from "@/widgets/CategoryFormDrawer";

import {CategoryCard} from "./ui/CategoryCard";

const CategoriesPage = () => {
  const {data: categories} = useCategories();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const handleCategoryClick = (category: Category) => {
    setOpen(true);
    setSelectedCategory(category);
  };

  const handleAddCategoryClick = () => {
    setOpen(true);
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Категории</h1>
        <Button onClick={handleAddCategoryClick}>Добавить</Button>
      </div>

      <ScrollArea className="h-[calc(100vh-10rem)] pr-2">
        <div className="flex flex-col gap-2">
          {categories?.map(category => (
            <div onClick={() => handleCategoryClick(category)} key={category.id}>
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </ScrollArea>

      <CategoryFormDrawer open={open} onOpenChange={setOpen} categoryId={selectedCategory?.id} />
    </div>
  );
};

export default CategoriesPage;
