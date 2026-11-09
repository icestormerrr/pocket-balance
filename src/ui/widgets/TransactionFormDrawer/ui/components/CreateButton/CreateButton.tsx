import type {FC} from "react";
import {useFormContext} from "react-hook-form";
import {toast} from "sonner";

import {useCreateTransaction} from "@/ui/entities/transaction";
import {getStatusBarHeight} from "@/ui/shared/lib/styling";
import {Button} from "@/ui/shared/ui/button";

import {saveCreationDefaults, saveRecentCategory} from "../../../utils/creationPreferences";
import type {TransactionFormState} from "../../../utils/schema";

type Props = {
  onSuccess: () => void;
};

export const CreateButton: FC<Props> = ({onSuccess}) => {
  const {mutate: createTransaction} = useCreateTransaction();
  const {handleSubmit, watch} = useFormContext<TransactionFormState>();
  const categoryType = watch("categoryType");

  const handleCreate = (formValues: TransactionFormState) => {
    createTransaction(
      {
        amount: formValues.amount,
        categoryId: formValues.categoryId,
        date: formValues.date,
        comment: formValues.comment,
        accountId: formValues.accountId,
      },
      {
        onSuccess: () => {
          saveCreationDefaults({accountId: formValues.accountId, date: formValues.date});
          saveRecentCategory(formValues.categoryType, formValues.categoryId);
          onSuccess();
          toast("Операция успешно создана", {
            action: {
              label: "ОК",
              onClick: () => console.log("Undo"),
            },
            style: {marginTop: getStatusBarHeight()},
            position: "top-center",
          });
        },
        onError: () => {
          toast("Произошла ошибка при создании операции", {
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

  const handleInvalidCreate = () => {
    requestAnimationFrame(() => {
      document.querySelector("[data-invalid='true']")?.scrollIntoView({behavior: "smooth", block: "center"});
    });
  };
  const handleCreateButtonClick = handleSubmit(handleCreate, handleInvalidCreate);

  return (
    <Button size="lg" onClick={() => void handleCreateButtonClick()} className="h-12 w-full rounded-2xl">
      Добавить {categoryType === "expense" ? "расход" : "доход"}
    </Button>
  );
};
