import {useCallback, useState} from "react";

import {type CategoriesFilter, type Category, useCategories} from "@/entities/category";
import {CategoriesList} from "@/pages/categories/ui/CategoriesList/CategoriesList";
import {CategoryFilters} from "@/pages/categories/ui/CategoryFilters/CategoryFilters";
import {Button} from "@/shared/ui/button";
import CategoryFormDrawer from "@/widgets/CategoryFormDrawer";

const CategoriesPage = () => {
  const [filter, setFilter] = useState<CategoriesFilter>({});
  const {data: categories} = useCategories(filter);

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
          <h1 className="flex justify-between items-center text-2xl font-bold">Категории</h1>

          <Button onClick={handleAddCategoryClick}>Добавить</Button>
        </div>

        <div>
          <CategoryFilters filter={filter} onFilterChange={setFilter} />
        </div>

        {categories && <CategoriesList categories={categories} onCategoryClick={handleCategoryClick} />}
      </div>
    </>
  );
};

export default CategoriesPage;
