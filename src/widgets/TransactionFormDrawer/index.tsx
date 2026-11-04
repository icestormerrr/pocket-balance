import {useTransaction} from "@/entities/transaction";
import {X} from "lucide-react";

import {Drawer, DrawerContent, DrawerFooter, DrawerTitle} from "@/shared/ui/drawer";
import {zodResolver} from "@hookform/resolvers/zod";
import {type FC, memo, useCallback, useEffect} from "react";
import {FormProvider, useForm} from "react-hook-form";

import {getStatusBarHeight} from "@/shared/lib/styling";
import {Button} from "@/shared/ui/button";
import {DeleteButton} from "@/widgets/TransactionFormDrawer/ui/components/DeleteButton/DeleteButton";
import {CreateButton} from "./ui/components/CreateButton/CreateButton";
import {TransactionFormFields} from "./ui/components/TransactionFormFields/TransactionFormFields";
import {UpdateButton} from "./ui/components/UpdateButton/UpdateButton";
import {getCreationDefaults} from "./utils/creationPreferences";
import {type TransactionFormState, transactionFormSchema} from "./utils/schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId?: string;
};

const getDefaultValues = (): TransactionFormState => ({
  ...getCreationDefaults(),
  categoryType: "expense",
  categoryId: "",
  id: "",
  amount: 0,
  comment: "",
});

const TransactionFormDrawer: FC<Props> = memo(({open, onOpenChange, transactionId}) => {
  const {refetch} = useTransaction(transactionId);

  const form = useForm<TransactionFormState>({
    resolver: zodResolver(transactionFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: getDefaultValues(),
  });
  const id = form.watch("id");

  useEffect(() => {
    if (!open) return;

    void refetch().then(query => {
      if (query.data) {
        form.reset(query.data);
      } else {
        form.reset(getDefaultValues());
      }
    });
  }, [form, open, refetch]);

  const handleSuccessButtonClick = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <FormProvider {...form}>
      <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={false} dismissible={false}>
        <DrawerContent
          className="mx-auto max-w-lg overflow-hidden rounded-t-[2rem]"
          style={{minHeight: window.innerHeight - getStatusBarHeight()}}
          hideBar
        >
          <DrawerTitle className="sr-only">{id ? "Редактировать операцию" : "Новая операция"}</DrawerTitle>
          <div className="no-scrollbar relative min-h-0 flex-1 overflow-auto">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] [mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_100%)] blur-2xl"
              style={{
                background:
                  "radial-gradient(ellipse at 16% -12%, oklch(0.42 0.02 240 / 32%), transparent 64%), radial-gradient(ellipse at 86% 5%, oklch(0.5 0.025 230 / 16%), transparent 68%)",
              }}
            />
            <div className="relative z-10 flex flex-col gap-5 px-5 pt-5 pb-4">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={handleSuccessButtonClick}
                  aria-label="Закрыть"
                >
                  <X />
                </Button>
              </div>

              <TransactionFormFields />
              {id && <DeleteButton onSuccess={handleSuccessButtonClick} />}
            </div>
          </div>

          <DrawerFooter detached>
            {id ? (
              <UpdateButton onSuccess={handleSuccessButtonClick} />
            ) : (
              <CreateButton onSuccess={handleSuccessButtonClick} />
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </FormProvider>
  );
});

TransactionFormDrawer.displayName = "TransactionFormDrawer";

export default TransactionFormDrawer;
