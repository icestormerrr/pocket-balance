import type {FC} from "react";
import {useFormContext} from "react-hook-form";
import {toast} from "sonner";

import {useUpdateTransfer} from "@/entities/transaction";
import {getStatusBarHeight} from "@/shared/lib/styling";
import {Button} from "@/shared/ui/button";

import type {TransferFormState} from "../../../model/schema";

type Props = {
  onSuccess: () => void;
};

export const UpdateButton: FC<Props> = ({onSuccess}) => {
  const {mutate: updateTransfer} = useUpdateTransfer();
  const {getValues, formState} = useFormContext<TransferFormState>();

  const handleUpdateButtonClick = () => {
    const formValues = getValues();
    if (!formValues.transferId) return;

    updateTransfer(
      {
        transferId: formValues.transferId,
        payload: {
          amount: formValues.amount,
          date: formValues.date,
          fromAccountId: formValues.fromAccountId,
          toAccountId: formValues.toAccountId,
        },
      },
      {
        onSuccess: () => {
          onSuccess();
          toast("Перевод успешно сохранен", {
            action: {
              label: "ОК",
              onClick: () => console.log("Undo"),
            },
            style: {marginTop: getStatusBarHeight()},
            position: "top-center",
          });
        },
        onError: () => {
          toast("Произошла ошибка при сохранении перевода", {
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
    <Button size="lg" onClick={handleUpdateButtonClick} disabled={!formState.isValid}>
      Сохранить
    </Button>
  );
};

