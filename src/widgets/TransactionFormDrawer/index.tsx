import {useTransaction} from "@/entities/transaction";
import {Drawer, DrawerContent, DrawerTitle} from "@/shared/ui/drawer";
import {zodResolver} from "@hookform/resolvers/zod";
import {type FC, memo, useCallback, useEffect} from "react";
import {FormProvider, useForm} from "react-hook-form";

import {type TransactionsFormState, transactionFormSchema} from "./model/schema";
import {CreateButton} from "./ui/components/CreateButton/CreateButton";
import {DeleteButton} from "./ui/components/DeleteButton/DeleteButton";
import {TransactionFormFields} from "./ui/components/TransactionFormFields/TransactionFormFields";
import {UpdateButton} from "./ui/components/UpdateButton/UpdateButton";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId?: string;
};

const defaultValues: TransactionsFormState = {
  date: new Date().toUTCString(),
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
    <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={false}>
      <DrawerContent className="min-h-[90vh] transition-all">
        <FormProvider {...form}>
          <DrawerTitle></DrawerTitle>

          <div className="p-4 mx-auto w-full max-w-sm">
            <div className="pb-0 flex flex-col gap-2">
              <TransactionFormFields />
            </div>
            <div className={"mt-2 flex justify-between"}>
              {id && (
                <div className="basis-[10%]">
                  <DeleteButton onSuccess={handleSuccessButtonClick} />
                </div>
              )}

              {id ? (
                <div className="basis-[85%]">
                  <UpdateButton onSuccess={handleSuccessButtonClick} />
                </div>
              ) : (
                <div className="basis-[100%]">
                  <CreateButton onSuccess={handleSuccessButtonClick} />
                </div>
              )}
            </div>
          </div>
        </FormProvider>
      </DrawerContent>
    </Drawer>
  );
});

TransactionsFormDrawer.displayName = "OperationFormDrawer";

export default TransactionsFormDrawer;
