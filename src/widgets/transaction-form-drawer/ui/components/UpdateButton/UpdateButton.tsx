import {Save} from "lucide-react";
import {useFormContext} from "react-hook-form";
import {toast} from "sonner";

import {useUpdateTransaction} from "@/entities/transaction";
import {Button} from "@/shared/ui/button.tsx";

import type {FC} from "react";
import type {TransactionsFormState} from "../../../model/schema.ts";

type Props = {
  onSuccess: () => void;
};

const UpdateButton: FC<Props> = ({onSuccess}) => {
  const {mutate: updateTransaction} = useUpdateTransaction();
  const {getValues, formState} = useFormContext<TransactionsFormState>();

  const handleUpdateButtonClick = () => {
    const formValues = getValues();
    if (!formValues.id) return;

    updateTransaction(
      {
        id: formValues.id,
        tx: {
          amount: formValues.amount,
          categoryId: formValues.categoryId,
          date: formValues.date,
          comment: formValues.comment,
        },
      },
      {
        onSuccess: () => {
          onSuccess();
          toast("Операция успешно сохранена", {
            action: {
              label: "ОК",
              onClick: () => console.log("Undo"),
            },
          });
        },
        onError: () => {
          toast("Произошла ошибка при сохранении операции", {
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
    <Button onClick={handleUpdateButtonClick} disabled={!formState.isValid}>
      Сохранить
      <Save />
    </Button>
  );
};

export default UpdateButton;
