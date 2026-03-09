import type {FC} from "react";
import {useFormContext} from "react-hook-form";
import {toast} from "sonner";

import {useCreateTransfer} from "@/entities/transaction";
import {getStatusBarHeight} from "@/shared/lib/styling";
import {Button} from "@/shared/ui/button";

import type {TransferFormState} from "../../../model/schema";

type Props = {
  onSuccess: () => void;
};

export const CreateButton: FC<Props> = ({onSuccess}) => {
  const {mutate: createTransfer} = useCreateTransfer();
  const {getValues, formState} = useFormContext<TransferFormState>();

  const handleCreateButtonClick = () => {
    const formValues = getValues();

    createTransfer(
      {
        amount: formValues.amount,
        date: formValues.date,
        fromAccountId: formValues.fromAccountId,
        toAccountId: formValues.toAccountId,
      },
      {
        onSuccess: () => {
          onSuccess();
          toast("Перевод создан успешно", {
            action: {
              label: "ОК",
              onClick: () => console.log("Undo"),
            },
            style: {marginTop: getStatusBarHeight()},
            position: "top-center",
          });
        },
        onError: () => {
          toast("Произошла ошибка при создании перевода", {
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
    <Button size="lg" onClick={handleCreateButtonClick} disabled={!formState.isValid}>
      Создать
    </Button>
  );
};

