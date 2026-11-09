import type {FC} from "react";
import {useFormContext} from "react-hook-form";
import {toast} from "sonner";

import {useCreateAccount} from "@/ui/entities/account";
import {getStatusBarHeight} from "@/ui/shared/lib/styling";
import {Button} from "@/ui/shared/ui/button";

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
    <Button
      size="lg"
      className="h-12 w-full rounded-2xl"
      onClick={handleCreateButtonClick}
      disabled={!formState.isValid}
    >
      Создать счёт
    </Button>
  );
};
