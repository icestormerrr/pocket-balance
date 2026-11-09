import {Trash2} from "lucide-react";
import type {FC} from "react";
import {useFormContext} from "react-hook-form";
import {toast} from "sonner";

import {useDeleteAccount} from "@/ui/entities/account";
import {getStatusBarHeight} from "@/ui/shared/lib/styling";
import {Button} from "@/ui/shared/ui/button";

import type {AccountFormState} from "../../../model/schema";

type Props = {
  onSuccess: () => void;
};

export const DeleteButton: FC<Props> = ({onSuccess}) => {
  const {mutate: deleteTransaction} = useDeleteAccount();
  const {getValues} = useFormContext<AccountFormState>();

  const handleDeleteButtonClick = () => {
    const formValues = getValues();
    if (!formValues.id) return;

    deleteTransaction(formValues.id, {
      onSuccess: () => {
        onSuccess();
        toast("Счёт успешно удален", {
          action: {
            label: "ОК",
            onClick: () => console.log("Undo"),
          },
          style: {marginTop: getStatusBarHeight()},
          position: "top-center",
        });
      },
      onError: () => {
        toast("Произошла ошибка при удалении счёта", {
          action: {
            label: "ОК",
            onClick: () => console.log("Undo"),
          },
          style: {marginTop: getStatusBarHeight()},
          position: "top-center",
        });
      },
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleDeleteButtonClick}
      className="h-12 w-full rounded-2xl border-destructive/45 text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      <Trash2 data-icon="inline-start" />
      Удалить счёт
    </Button>
  );
};
