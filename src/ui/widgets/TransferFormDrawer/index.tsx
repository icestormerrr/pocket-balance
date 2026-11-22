import {zodResolver} from "@hookform/resolvers/zod";
import {type FC, memo, useCallback, useEffect} from "react";
import {FormProvider, useForm} from "react-hook-form";

import {DateConverter} from "@/shared/lib/datetime";
import {useTransfer} from "@/ui/entities/transaction";
import {getStatusBarHeight} from "@/ui/shared/lib/styling";
import {Button} from "@/ui/shared/ui/button";
import {Drawer, DrawerContent, DrawerFooter} from "@/ui/shared/ui/drawer";
import {DrawerCloseButton} from "@/ui/shared/ui/drawer-close-button";
import {GradientBlob} from "@/ui/shared/ui/gradient-blob";

import {transferFormSchema, type TransferFormState} from "./model/schema";
import {CreateButton} from "./ui/components/CreateButton/CreateButton";
import {DeleteButton} from "./ui/components/DeleteButton/DeleteButton";
import {TransferFormFields} from "./ui/components/TransferFormFields/TransferFormFields";
import {UpdateButton} from "./ui/components/UpdateButton/UpdateButton";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transferId?: string;
};

const defaultValues: TransferFormState = {
  transferId: "",
  date: DateConverter.dateToISO(new Date()),
  amount: 0,
  fromAccountId: "",
  toAccountId: "",
};

const TransferFormDrawer: FC<Props> = memo(({open, onOpenChange, transferId}) => {
  const {refetch} = useTransfer(transferId);

  const form = useForm<TransferFormState>({
    resolver: zodResolver(transferFormSchema),
    mode: "onChange",
    defaultValues,
  });
  const formTransferId = form.watch("transferId");

  useEffect(() => {
    if (!open) return;

    if (!transferId) {
      form.reset(defaultValues);
      return;
    }

    refetch().then(query => {
      if (!query.data) {
        form.reset(defaultValues);
        return;
      }

      form.reset(query.data);
    });
  }, [open, transferId, refetch, form]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    form.reset(defaultValues);
  }, [onOpenChange, form]);

  return (
    <FormProvider {...form}>
      <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={false} dismissible={false}>
        <DrawerContent
          className={"overflow-hidden"}
          style={{minHeight: window.innerHeight - getStatusBarHeight()}}
          hideBar
        >
          <div className="relative min-h-0 flex-1 overflow-auto p-4">
            <GradientBlob colorFrom="#fff" colorTo="#fff" size={150} opacity={1} position="top" zIndex={-1} />

            <div className="mb-5">
              <DrawerCloseButton onClick={handleClose} />
            </div>
            <TransferFormFields />
            {formTransferId && (
              <div className={"my-6"}>
                <DeleteButton onSuccess={handleClose} />
              </div>
            )}
          </div>

          <DrawerFooter className="pb-8">
            <div className={"flex justify-between"}>
              <Button size={"lg"} variant={"outline"} onClick={handleClose}>
                Отмена
              </Button>

              {formTransferId ? <UpdateButton onSuccess={handleClose} /> : <CreateButton onSuccess={handleClose} />}
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </FormProvider>
  );
});

TransferFormDrawer.displayName = "TransferFormDrawer";

export default TransferFormDrawer;
