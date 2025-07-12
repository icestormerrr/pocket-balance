import {Save} from "lucide-react";
import {useFormContext} from "react-hook-form";
import {toast} from "sonner";

import {useUpdateCategory} from "@/entities/category";
import {Button} from "@/shared/ui/button.tsx";

import type {FC} from "react";
import type {CategoryFormState} from "../../../model/schema.ts";

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
        data: {type: formValues.type, name: formValues.name, color: formValues.color},
      },
      {
        onSuccess: () => {
          onSuccess();
          toast("Категория успешно сохранена", {
            action: {
              label: "ОК",
              onClick: () => console.log("Undo"),
            },
          });
        },
        onError: () => {
          toast("Произошла ошибка при сохранении категории", {
            action: {
              label: "ОК",
              onClick: () => console.log("Undo"),
            },
          });
        },
      }
    );
  };

  return (
    <Button onClick={handleUpdateButtonClick} disabled={!formState.isValid} className="w-full">
      Сохранить
      <Save />
    </Button>
  );
};
