import {Trash2} from "lucide-react";
import type {FC} from "react";
import {useFormContext} from "react-hook-form";
import {toast} from "sonner";

import {useDeleteCategory} from "@/ui/entities/category";
import {getStatusBarHeight} from "@/ui/shared/lib/styling";
import {Button} from "@/ui/shared/ui/button";

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
          style: {marginTop: getStatusBarHeight()},
          position: "top-center",
        });
      },
      onError: () => {
        toast("Произошла ошибка при удалении категории", {
          action: {
            label: "ОК",
            onClick: () => console.log("Undo"),
          },
          style: {marginTop: getStatusBarHeight()},
          position: "top-center",
        });
      },
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleDeleteButtonClick}
      className="h-12 w-full rounded-2xl border-destructive/45 text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      <Trash2 data-icon="inline-start" />
      Удалить категорию
    </Button>
  );
};
