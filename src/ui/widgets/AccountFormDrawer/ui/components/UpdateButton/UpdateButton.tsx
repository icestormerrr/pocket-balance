import {useFormContext} from "react-hook-form";
import {toast} from "sonner";

import {useUpdateAccount} from "@/ui/entities/account";
import {getStatusBarHeight} from "@/ui/shared/lib/styling";
import {Button} from "@/ui/shared/ui/button";

import type {AccountFormState} from "../../../model/schema";

type Props = {
  onSuccess: () => void;
};

export const UpdateButton = ({onSuccess}: Props) => {
  const {mutate: updateTransaction} = useUpdateAccount();
  const {getValues, formState} = useFormContext<AccountFormState>();

  const handleUpdateButtonClick = () => {
    const formValues = getValues();
    if (!formValues.id) return;

    updateTransaction(
      {
        id: formValues.id,
        data: {
          name: formValues.name,
          startAmount: formValues.startAmount,
          currencyCode: formValues.currencyCode,
        },
      },
      {
        onSuccess: () => {
          onSuccess();
          toast("Счёт успешно сохранён", {
            action: {
              label: "ОК",
              onClick: () => console.log("Undo"),
            },
            style: {marginTop: getStatusBarHeight()},
            position: "top-center",
          });
        },
        onError: () => {
          toast("Произошла ошибка при сохранении счёта", {
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
      onClick={handleUpdateButtonClick}
      disabled={!formState.isValid}
    >
      Сохранить изменения
    </Button>
  );
};
