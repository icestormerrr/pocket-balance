import type {FC} from "react";
import {useFormContext} from "react-hook-form";
import {toast} from "sonner";

import {useUpdateTransaction} from "@/ui/entities/transaction";
import {getStatusBarHeight} from "@/ui/shared/lib/styling";
import {Button} from "@/ui/shared/ui/button";

import type {TransactionFormState} from "../../../utils/schema";

type Props = {
  onSuccess: () => void;
};

export const UpdateButton: FC<Props> = ({onSuccess}) => {
  const {mutate: updateTransaction} = useUpdateTransaction();
  const {handleSubmit} = useFormContext<TransactionFormState>();

  const handleUpdate = (formValues: TransactionFormState) => {
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

  const handleInvalidUpdate = () => {
    requestAnimationFrame(() => {
      document.querySelector("[data-invalid='true']")?.scrollIntoView({behavior: "smooth", block: "center"});
    });
  };
  const handleUpdateButtonClick = handleSubmit(handleUpdate, handleInvalidUpdate);

  return (
    <Button size="lg" onClick={() => void handleUpdateButtonClick()} className="h-12 w-full rounded-2xl">
      Сохранить изменения
    </Button>
  );
};
