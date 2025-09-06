import {Trash} from "lucide-react";
import {useFormContext} from "react-hook-form";
import {toast} from "sonner";

import {useDeleteTransaction} from "@/entities/transaction";
import {getStatusBarHeight} from "@/shared/lib/styling";
import {Button} from "@/shared/ui/button";

import type {FC} from "react";
import type {TransactionsFormState} from "../../../model/schema";

type Props = {
  onSuccess: () => void;
};

export const DeleteButton: FC<Props> = ({onSuccess}) => {
  const {mutate: deleteTransaction} = useDeleteTransaction();
  const {getValues} = useFormContext<TransactionsFormState>();

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
    <Button size="lg" variant="outline" className={"basis-[45%]"} onClick={handleDeleteButtonClick}>
      <Trash />
    </Button>
  );
};
