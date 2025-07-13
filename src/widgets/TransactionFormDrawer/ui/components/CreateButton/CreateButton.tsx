import {Save} from "lucide-react";
import {useFormContext} from "react-hook-form";
import {toast} from "sonner";

import {useCreateTransaction} from "@/entities/transaction";
import {Button} from "@/shared/ui/button";

import type {FC} from "react";
import type {TransactionsFormState} from "../../../model/schema";

type Props = {
  onSuccess: () => void;
};

export const CreateButton: FC<Props> = ({onSuccess}) => {
  const {mutate: createTransaction} = useCreateTransaction();
  const {getValues, formState} = useFormContext<TransactionsFormState>();

  const handleCreateButtonClick = () => {
    const formValues = getValues();

    createTransaction(
      {
        amount: formValues.amount,
        categoryId: formValues.categoryId,
        date: formValues.date,
        comment: formValues.comment,
      },
      {
        onSuccess: () => {
          onSuccess();
          toast("Операция успешно создана", {
            action: {
              label: "ОК",
              onClick: () => console.log("Undo"),
            },
          });
        },
        onError: () => {
          toast("Произошла ошибка при создании операции", {
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
    <Button onClick={handleCreateButtonClick} disabled={!formState.isValid} className="w-full">
      Создать
      <Save />
    </Button>
  );
};
