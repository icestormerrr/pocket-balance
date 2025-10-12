import type {FC} from "react";
import {useFormContext} from "react-hook-form";
import {toast} from "sonner";

import {useCreateAccount} from "@/entities/account";
import {getStatusBarHeight} from "@/shared/lib/styling";
import {Button} from "@/shared/ui/button";

import type {AccountFormState} from "../../../model/schema";

type Props = {
  onSuccess: () => void;
};

export const CreateButton: FC<Props> = ({onSuccess}) => {
  const {mutate: createAccount} = useCreateAccount();
  const {getValues, formState} = useFormContext<AccountFormState>();

  const handleCreateButtonClick = () => {
    const formValues = getValues();

    createAccount(
      {
        name: formValues.name,
        currencyCode: formValues.currencyCode,
        startAmount: formValues.startAmount,
      },
      {
        onSuccess: () => {
          onSuccess();
          toast("Счёт успешно создан", {
            action: {
              label: "ОК",
              onClick: () => console.log("Undo"),
            },
            style: {marginTop: getStatusBarHeight()},
            position: "top-center",
          });
        },
        onError: () => {
          toast("Произошла ошибка при создании счёта", {
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
