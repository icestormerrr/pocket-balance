import {zodResolver} from "@hookform/resolvers/zod";
import {X} from "lucide-react";
import {type FC, memo, useCallback, useEffect} from "react";
import {FormProvider, useForm} from "react-hook-form";

import {useAccount} from "@/ui/entities/account";
import {getStatusBarHeight} from "@/ui/shared/lib/styling";
import {Button} from "@/ui/shared/ui/button";
import {Drawer, DrawerContent, DrawerFooter, DrawerTitle} from "@/ui/shared/ui/drawer";

import {accountFormSchema, type AccountFormState} from "./model/schema";
import {AccountFormFields} from "./ui/components/AccountFormFields/AccountFormFields";
import {CreateButton} from "./ui/components/CreateButton/CreateButton";
import {DeleteButton} from "./ui/components/DeleteButton/DeleteButton";
import {UpdateButton} from "./ui/components/UpdateButton/UpdateButton";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId?: string;
};

const defaultValues: AccountFormState = {
  id: "",
  name: "",
  startAmount: 0,
  currencyCode: "",
};

const AccountFormDrawer: FC<Props> = memo(({open, onOpenChange, accountId}) => {
  const {refetch} = useAccount(accountId);

  const form = useForm<AccountFormState>({
    resolver: zodResolver(accountFormSchema),
    mode: "onChange",
    defaultValues,
  });
  const id = form.watch("id");

  useEffect(() => {
    if (!open) return;

    void refetch().then(query => {
      if (query.data) {
        form.reset(query.data);
      } else {
        form.reset(defaultValues);
      }
    });
  }, [form, open, refetch]);

  const handleSuccessButtonClick = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <FormProvider {...form}>
      <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={false}>
        <DrawerContent
          className="mx-auto max-w-lg overflow-hidden rounded-t-2xl"
          style={{minHeight: window.innerHeight - getStatusBarHeight()}}
          hideBar
        >
          <DrawerTitle className="sr-only">{id ? "Редактировать счёт" : "Новый счёт"}</DrawerTitle>
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

              <AccountFormFields />
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

AccountFormDrawer.displayName = "AccountFormDrawer";

export default AccountFormDrawer;
