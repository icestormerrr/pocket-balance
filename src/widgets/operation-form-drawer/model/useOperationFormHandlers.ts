import {useCategoryStore} from "@/entities/category";
import {useOperationStore} from "@/entities/operation";
import type {OperationFormValues} from "@/widgets/operation-form-drawer/model/schema";
import type {UseFormReturn} from "react-hook-form";
import {toast} from "sonner";

export const useOperationFormHandlers = (form: UseFormReturn<OperationFormValues>) => {
  const categories = useCategoryStore(state => state.categories);
  const {operations, addOperation, updateOperation, deleteOperation} = useOperationStore();

  const {watch, getValues, reset, formState} = form;
  const id = watch("id");

  const handleSave = () => {
    const formValues = getValues();

    if (!formValues.id) {
      addOperation({
        amount: formValues.amount,
        categoryId: formValues.categoryId,
        date: formValues.date,
        comment: formValues.comment,
      });
    } else {
      updateOperation({
        id: formValues.id,
        amount: formValues.amount,
        categoryId: formValues.categoryId,
        date: formValues.date,
        comment: formValues.comment,
      });
    }

    toast("Операция успешно сохранена", {
      action: {
        label: "ОК",
        onClick: () => console.log("Undo"),
      },
    });
  };

  const handleDelete = () => {
    deleteOperation(form.getValues("id")!);
    toast("Операция успешно удалена", {
      action: {
        label: "ОК",
        onClick: () => console.log("Undo"),
      },
    });
  };

  const handleInit = (id?: string) => {
    if (id) {
      const operation = operations.find(o => o.id === id);
      if (operation) {
        reset({...operation, categoryType: categories[operation.categoryId]?.type});
      }
    } else {
      reset({date: new Date().toUTCString(), categoryType: "expense"});
    }
  };

  return {
    handleSave,
    handleDelete,
    handleInit,
  };
};
