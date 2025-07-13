import {useFormContext} from "react-hook-form";
import {toast} from "sonner";

import {useDeleteCategory} from "@/entities/category";
import {Button} from "@/shared/ui/button";

import type {FC} from "react";
import type {CategoryFormState} from "../../../model/schema";

type Props = {
  onSuccess: () => void;
};

export const DeleteButton: FC<Props> = ({onSuccess}) => {
  const {mutate: deleteCategory} = useDeleteCategory();
  const {getValues} = useFormContext<CategoryFormState>();

  const handleDeleteButtonClick = () => {
    const formValues = getValues();
    if (!formValues.id) return;

    deleteCategory(formValues.id, {
      onSuccess: () => {
        onSuccess();
        toast("Категория успешно удалена", {
          action: {
            label: "ОК",
            onClick: () => console.log("Undo"),
          },
        });
      },
      onError: () => {
        toast("Произошла ошибка при удалении категории", {
          action: {
            label: "ОК",
            onClick: () => console.log("Undo"),
          },
        });
      },
    });
  };

  return (
    <Button className={"bg-red-500 basis-[45%]"} onClick={handleDeleteButtonClick}>
      Удалить
    </Button>
  );
};
