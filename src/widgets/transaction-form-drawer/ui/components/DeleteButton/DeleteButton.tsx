import {useFormContext} from "react-hook-form";
import {toast} from "sonner";

import {useDeleteTransaction} from "@/entities/transaction";
import {Button} from "@/shared/ui/button.tsx";

import type {FC} from "react";
import type {TransactionsFormState} from "../../../model/schema.ts";

type Props = {
  onSuccess: () => void;
};

const DeleteButton: FC<Props> = ({onSuccess}) => {
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
        });
      },
      onError: () => {
        toast("Произошла ошибка при удалении операции", {
          action: {
            label: "ОК",
            onClick: () => console.log("Undo"),
          },
        });
      },
    });
  };

  return (
    <Button className={"bg-red-500 basis-[45%]"} onClick={handleDeleteButtonClick}>
      Удалить
    </Button>
  );
};

export default DeleteButton;
