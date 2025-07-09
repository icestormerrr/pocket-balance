import {Button} from "@/shared/ui/button";
import {Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerTitle} from "@/shared/ui/drawer";
import {useOperationFormHandlers} from "@/widgets/operation-form-drawer/model/useOperationFormHandlers";
import {OperationFormFields} from "@/widgets/operation-form-drawer/ui/OperationFormFields";
import {Save, X} from "lucide-react";
import {forwardRef, useImperativeHandle, useState} from "react";
import {FormProvider} from "react-hook-form";
import {useOperationForm} from "./model/useOperationForm";

type Props = {};

export type OperationFormDrawerRef = {
  openDrawer: (id?: string) => void;
  closeDrawer: () => void;
};

const OperationFormDrawer = forwardRef<OperationFormDrawerRef>(({}: Props, ref) => {
  const form = useOperationForm();
  const {watch, formState} = form;
  const id = watch("id");
  const {handleSave, handleDelete, handleInit} = useOperationFormHandlers(form);

  const [open, setOpen] = useState(false);
  useImperativeHandle(ref, () => ({
    openDrawer: id => {
      handleInit(id);
      setOpen(true);
    },
    closeDrawer: () => setOpen(false),
  }));

  return (
    <Drawer open={open} onOpenChange={setOpen} repositionInputs={false}>
      <DrawerContent className="min-h-[90vh] transition-all">
        <FormProvider {...form}>
          <DrawerTitle></DrawerTitle>

          <DrawerTitle></DrawerTitle>
          <div className="mx-auto w-full max-w-sm">
            <div className="p-4 pb-0 flex flex-col gap-2">
              <OperationFormFields />
            </div>
            <DrawerFooter className={"mt-50"}>
              <DrawerClose asChild>
                <Button onClick={handleSave} disabled={!formState.isValid}>
                  Сохранить
                  <Save />
                </Button>
              </DrawerClose>
              <div className={"flex justify-between mt-2"}>
                <DrawerClose asChild>
                  {id && (
                    <Button onClick={handleDelete} className={"bg-red-500 basis-[45%]"}>
                      Удалить
                    </Button>
                  )}
                </DrawerClose>

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

export default OperationFormDrawer;
