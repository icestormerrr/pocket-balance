import {Save} from "lucide-react";
import {useFormContext} from "react-hook-form";
import {toast} from "sonner";

import {useUpdateCategory} from "@/entities/category";
import {getStatusBarHeight} from "@/shared/lib/styling";
import {Button} from "@/shared/ui/button";

import type {FC} from "react";
import type {CategoryFormState} from "../../../model/schema";

type Props = {
  onSuccess: () => void;
};

export const UpdateButton: FC<Props> = ({onSuccess}) => {
  const {mutate: updateCategory} = useUpdateCategory();
  const {getValues, formState} = useFormContext<CategoryFormState>();

  const handleUpdateButtonClick = () => {
    const formValues = getValues();
    if (!formValues.id) return;

    updateCategory(
      {
        id: formValues.id,
        data: {type: formValues.type, name: formValues.name, color: formValues.color, shortName: formValues.shortName},
      },
      {
        onSuccess: () => {
          onSuccess();
          toast("Категория успешно сохранена", {
            action: {
              label: "ОК",
              onClick: () => console.log("Undo"),
            },
            style: {marginTop: getStatusBarHeight()},
            position: "top-center",
          });
        },
        onError: () => {
          toast("Произошла ошибка при сохранении категории", {
            action: {
              label: "ОК",
              onClick: () => console.log("Undo"),
            },
            style: {marginTop: getStatusBarHeight()},
            position: "top-center",
          });
        },
      }
    );
  };

  return (
    <Button size="lg" onClick={handleUpdateButtonClick} disabled={!formState.isValid} className="w-full">
      Сохранить
      <Save />
    </Button>
  );
};
