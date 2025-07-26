import type {FC} from "react";

import {type CategoriesFilter, CATEGORY_TYPE_OPTIONS, type CategoryType} from "@/entities/category";
import {BadgeGroup} from "@/shared/ui/badge";

type Props = {
  filter: CategoriesFilter;
  onFilterChange: (filter: CategoriesFilter) => void;
};

export const CategoryFilters: FC<Props> = ({filter, onFilterChange}) => {
  const handleTypeChange = (type: CategoryType | null) => {
    onFilterChange({...filter, type: type ?? undefined});
  };
  return <BadgeGroup value={filter.type} onChange={handleTypeChange} options={CATEGORY_TYPE_OPTIONS} />;
};
