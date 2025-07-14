import {Save} from "lucide-react";
import {useFormContext} from "react-hook-form";
import {toast} from "sonner";

import {useCreateCategory} from "@/entities/category";
import {getStatusBarHeight} from "@/shared/lib/styling";
import {Button} from "@/shared/ui/button";

import type {FC} from "react";
import type {CategoryFormState} from "../../../model/schema";

type Props = {
  onSuccess: () => void;
};

export const CreateButton: FC<Props> = ({onSuccess}) => {
  const {mutate: createCategory} = useCreateCategory();
  const {getValues, formState} = useFormContext<CategoryFormState>();

  const handleCreateButtonClick = () => {
    const formValues = getValues();

    createCategory(
      {type: formValues.type, name: formValues.name, color: formValues.color},
      {
        onSuccess: () => {
          onSuccess();
          toast("Категория успешно создана", {
            action: {
              label: "ОК",
              onClick: () => console.log("Undo"),
            },
            style: {marginTop: getStatusBarHeight()},
            position: "top-center",
          });
        },
        onError: () => {
          toast("Произошла ошибка при создании категории", {
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
    <Button onClick={handleCreateButtonClick} disabled={!formState.isValid} className="w-full">
      Создать
      <Save />
    </Button>
  );
};
