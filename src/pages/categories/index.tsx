import {useCallback, useState} from "react";

import {type Category, useCategories} from "@/entities/category";
import {CategoriesList} from "@/pages/categories/ui/CategoriesList/CategoriesList";
import {Button} from "@/shared/ui/button";
import CategoryFormDrawer from "@/widgets/CategoryFormDrawer";

const CategoriesPage = () => {
  const {data: categories} = useCategories();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const handleCloseCategoryFormDrawer = useCallback(() => {
    setOpen(false);
    setSelectedCategory(undefined);
  }, []);

  const handleCategoryClick = useCallback((category: Category) => {
    setOpen(true);
    setSelectedCategory(category);
  }, []);

  const handleAddCategoryClick = () => {
    setOpen(true);
    setSelectedCategory(undefined);
  };

  return (
    <>
      <CategoryFormDrawer open={open} onOpenChange={handleCloseCategoryFormDrawer} categoryId={selectedCategory?.id} />

      <div className="p-4 space-y-4 max-w-md mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Категории</h1>
          <Button onClick={handleAddCategoryClick}>Добавить</Button>
        </div>

        {categories && <CategoriesList categories={categories} onCategoryClick={handleCategoryClick} />}
      </div>
    </>
  );
};

export default CategoriesPage;
