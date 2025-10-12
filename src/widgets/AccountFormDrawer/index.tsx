import {zodResolver} from "@hookform/resolvers/zod";
import {type FC, memo, useCallback, useEffect} from "react";
import {FormProvider, useForm} from "react-hook-form";

import {useAccount} from "@/entities/account";
import {getStatusBarHeight} from "@/shared/lib/styling";
import {Button} from "@/shared/ui/button";
import {Drawer, DrawerContent, DrawerFooter} from "@/shared/ui/drawer";

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
      <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={false}>
        <DrawerContent
          className="transition-all px-4 pb-4 mx-auto"
          style={{minHeight: window.innerHeight - getStatusBarHeight()}}
        >
          <div className="mt-4">
            <AccountFormFields />
            {id && (
              <div className={"my-6"}>
                <DeleteButton onSuccess={handleSuccessButtonClick} />
              </div>
            )}
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

AccountFormDrawer.displayName = "AccountFormDrawer";

export default AccountFormDrawer;
