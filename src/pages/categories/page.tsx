
import {CategoryCard} from "@/pages/categories/_ui/CategoryCard";
import {useCategoryStore} from "@/entities/category/model/store";
import type {Category} from "@/entities/category/model/types";
import {Button} from "@/shared/ui/button";
import {ScrollArea} from "@/shared/ui/scroll-area";
import CategoryFormDrawer, {type CategoryFormDrawerRef} from "@/widgets/category-form-drawer";
import {useRef} from "react";

export default function CategoriesPage() {
  const categories = useCategoryStore(state => state.categories);
  const drawerRef = useRef<CategoryFormDrawerRef>(null);

  const handleCategoryClick = (category: Category) => {
    drawerRef.current?.openDrawer(category.id);
  };

  const handleAddCategoryClick = () => {
    drawerRef.current?.openDrawer();
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Категории</h1>
        <Button onClick={() => handleAddCategoryClick()}>Добавить</Button>
      </div>

      <ScrollArea className="h-[calc(100vh-10rem)] pr-2">
        <div className="flex flex-col gap-2">
          {Object.values(categories).map(category => (
            <div onClick={() => handleCategoryClick(category)} key={category.id}>
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </ScrollArea>

      <CategoryFormDrawer ref={drawerRef} />
    </div>
  );
}
