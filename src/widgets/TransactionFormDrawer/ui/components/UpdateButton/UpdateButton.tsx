import {Save} from "lucide-react";
import {useFormContext} from "react-hook-form";
import {toast} from "sonner";

import {useUpdateTransaction} from "@/entities/transaction";
import {getStatusBarHeight} from "@/shared/lib/styling";
import {Button} from "@/shared/ui/button";

import type {FC} from "react";
import type {TransactionsFormState} from "../../../model/schema";

type Props = {
  onSuccess: () => void;
};

export const UpdateButton: FC<Props> = ({onSuccess}) => {
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
          accountId: formValues.accountId,
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
            style: {marginTop: getStatusBarHeight()},
            position: "top-center",
          });
        },
        onError: () => {
          toast("Произошла ошибка при сохранении операции", {
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
