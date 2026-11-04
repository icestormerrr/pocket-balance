import {Trash2} from "lucide-react";
import type {FC} from "react";
import {useFormContext} from "react-hook-form";
import {toast} from "sonner";

import {useDeleteTransaction} from "@/entities/transaction";
import {getStatusBarHeight} from "@/shared/lib/styling";
import {Button} from "@/shared/ui/button";

import type {TransactionFormState} from "../../../utils/schema";

type Props = {
  onSuccess: () => void;
};

export const DeleteButton: FC<Props> = ({onSuccess}) => {
  const {mutate: deleteTransaction} = useDeleteTransaction();
  const {getValues} = useFormContext<TransactionFormState>();

  const handleDeleteButtonClick = () => {
    const formValues = getValues();
    if (!formValues.id) return;

    deleteTransaction(formValues.id, {
      onSuccess: () => {
        onSuccess();
        toast("Операция успешно удалена", {
          action: {
            label: "ОК",
            onClick: () => console.log("Undo"),
          },
          style: {marginTop: getStatusBarHeight()},
          position: "top-center",
        });
      },
      onError: () => {
        toast("Произошла ошибка при удалении операции", {
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
      Удалить операцию
    </Button>
  );
};
