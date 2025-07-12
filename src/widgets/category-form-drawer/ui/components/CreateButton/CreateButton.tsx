import {Save} from "lucide-react";
import {useFormContext} from "react-hook-form";
import {toast} from "sonner";

import {useCreateCategory} from "@/entities/category";
import {Button} from "@/shared/ui/button.tsx";

import type {CategoryFormState} from "../../../model/schema.ts";

const CreateButton = () => {
  const {mutate: createCategory} = useCreateCategory();
  const {getValues, formState} = useFormContext<CategoryFormState>();

  const handleCreateButtonClick = () => {
    const formValues = getValues();

    createCategory(
      {type: formValues.type, name: formValues.name, color: formValues.color},
      {
        onSuccess: () => {
          toast("Категория успешно создана", {
            action: {
              label: "ОК",
              onClick: () => console.log("Undo"),
            },
          });
        },
        onError: () => {
          toast("Произошла ошибка при создании категории", {
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
    <Button onClick={handleCreateButtonClick} disabled={!formState.isValid}>
      Создать
      <Save />
    </Button>
  );
};

export default CreateButton;
