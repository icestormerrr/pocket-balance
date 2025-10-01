import {useTransaction} from "@/entities/transaction";
import {Drawer, DrawerContent, DrawerFooter} from "@/shared/ui/drawer";
import {zodResolver} from "@hookform/resolvers/zod";
import {type FC, memo, useCallback, useEffect} from "react";
import {FormProvider, useForm} from "react-hook-form";

import {DateConverter} from "@/shared/lib/datetime";
import {getStatusBarHeight} from "@/shared/lib/styling";
import {Button} from "@/shared/ui/button";
import {DeleteButton} from "@/widgets/TransactionFormDrawer/ui/components/DeleteButton/DeleteButton";
import {type TransactionsFormState, transactionFormSchema} from "./model/schema";
import {CreateButton} from "./ui/components/CreateButton/CreateButton";
import {TransactionFormFields} from "./ui/components/TransactionFormFields/TransactionFormFields";
import {UpdateButton} from "./ui/components/UpdateButton/UpdateButton";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId?: string;
};

const defaultValues: TransactionsFormState = {
  date: DateConverter.dateToISO(new Date()),
  categoryType: "expense",
  categoryId: "",
  id: "",
  amount: 0,
  comment: "",
  accountId: "",
};

const TransactionsFormDrawer: FC<Props> = memo(({open, onOpenChange, transactionId}) => {
  const {refetch} = useTransaction(transactionId);

  const form = useForm<TransactionsFormState>({
    resolver: zodResolver(transactionFormSchema),
    mode: "onChange",
    defaultValues,
  });
  const id = form.watch("id");

  useEffect(() => {
    if (!open) return;

    refetch().then(query => {
      if (query.data) {
        form.reset(query.data);
      } else {
        form.reset(defaultValues);
      }
    });
  }, [open]);

  const handleSuccessButtonClick = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <FormProvider {...form}>
      <Drawer open={open} onOpenChange={onOpenChange} dismissible={false} repositionInputs={false}>
        <DrawerContent
          className="transition-all px-4 pb-4 mx-auto"
          style={{minHeight: window.innerHeight - getStatusBarHeight()}}
        >
          <div className="mt-4">
            <TransactionFormFields />
            <div className={"my-6"}>
              <DeleteButton onSuccess={handleSuccessButtonClick} />
            </div>
          </div>

          <DrawerFooter className="px-0">
            <div className={"flex justify-between"}>
              <Button size={"lg"} variant={"outline"} onClick={handleSuccessButtonClick}>
                Отмена
              </Button>
              {id ? (
                <UpdateButton onSuccess={handleSuccessButtonClick} />
              ) : (
                <CreateButton onSuccess={handleSuccessButtonClick} />
              )}
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </FormProvider>
  );
});

TransactionsFormDrawer.displayName = "OperationFormDrawer";

export default TransactionsFormDrawer;
