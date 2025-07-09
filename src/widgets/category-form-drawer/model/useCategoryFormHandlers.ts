import {useCategoryStore} from "@/entities/category";
import type {UseFormReturn} from "react-hook-form";
import {toast} from "sonner";
import type {CategoryFormValues} from "./schema";

export const useCategoryFormHandlers = (form: UseFormReturn<CategoryFormValues>) => {
  const {addCategory, updateCategory, deleteCategory, categories} = useCategoryStore();
  const {getValues, watch, reset} = form;
  const id = watch("id");

  const handleSave = () => {
    const formValues = getValues();
    if (!formValues.id) {
      addCategory({type: formValues.type, name: formValues.name, color: formValues.color});
    } else {
      updateCategory({id: formValues.id, type: formValues.type, name: formValues.name, color: formValues.color});
    }
    toast("Категория успешно сохранена");
  };

  const handleDelete = () => {
    if (!id) return;
    deleteCategory(id);
    toast("Категория удалена");
  };

  const handleInit = (categoryId?: string) => {
    if (categoryId) {
      const category = categories[categoryId];
      category && reset(category);
    } else {
      reset({type: "expense"});
    }
  };

  return {
    handleSave,
    handleDelete,
    handleInit,
  };
};
