import {useTransaction} from "@/entities/transaction";
import {Button} from "@/shared/ui/button";
import {Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerTitle} from "@/shared/ui/drawer";
import {zodResolver} from "@hookform/resolvers/zod";
import {X} from "lucide-react";
import {type FC, memo, useCallback, useEffect} from "react";
import {FormProvider, useForm} from "react-hook-form";

import {type TransactionsFormState, transactionFormSchema} from "./model/schema.ts";
import CreateButton from "./ui/components/CreateButton/CreateButton.tsx";
import DeleteButton from "./ui/components/DeleteButton/DeleteButton.tsx";
import {TransactionFormFields} from "./ui/components/TransactionFormFields/TransactionFormFields.tsx";
import UpdateButton from "./ui/components/UpdateButton/UpdateButton.tsx";

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

          <div className="mx-auto w-full max-w-sm">
            <div className="p-4 pb-0 flex flex-col gap-2">
              <TransactionFormFields />
            </div>
            <DrawerFooter className={"mt-2"}>
              {id ? (
                <UpdateButton onSuccess={handleSuccessButtonClick} />
              ) : (
                <CreateButton onSuccess={handleSuccessButtonClick} />
              )}

              <div className={"flex justify-between mt-2"}>
                {id && <DeleteButton onSuccess={handleSuccessButtonClick} />}

                <DrawerClose asChild>
                  <Button variant="outline" className={"basis-[45%]"}>
                    Отменить
                    <X />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </div>
        </FormProvider>
      </DrawerContent>
    </Drawer>
  );
});

TransactionsFormDrawer.displayName = "OperationFormDrawer";

export default TransactionsFormDrawer;
