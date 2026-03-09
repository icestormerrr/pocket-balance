import type {FC} from "react";
import {useFormContext} from "react-hook-form";
import {toast} from "sonner";

import {useDeleteTransfer} from "@/entities/transaction";
import {getStatusBarHeight} from "@/shared/lib/styling";
import {Card} from "@/shared/ui/card";
import {Cell} from "@/shared/ui/cell";

import type {TransferFormState} from "../../../model/schema";

type Props = {
  onSuccess: () => void;
};

export const DeleteButton: FC<Props> = ({onSuccess}) => {
  const {mutate: deleteTransfer} = useDeleteTransfer();
  const {getValues} = useFormContext<TransferFormState>();

  const handleDeleteButtonClick = () => {
    const formValues = getValues();
    if (!formValues.transferId) return;

    deleteTransfer(formValues.transferId, {
      onSuccess: () => {
        onSuccess();
        toast("Перевод успешно удален", {
          action: {
            label: "ОК",
            onClick: () => console.log("Undo"),
          },
          style: {marginTop: getStatusBarHeight()},
          position: "top-center",
        });
      },
      onError: () => {
        toast("Произошла ошибка при удалении перевода", {
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
    <Card onClick={handleDeleteButtonClick} className="p-4">
      <Cell>
        <Cell.Content>
          <span className="text-[var(--negative-accent)]">Удалить</span>
        </Cell.Content>
      </Cell>
    </Card>
  );
};

