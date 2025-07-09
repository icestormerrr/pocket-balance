"use client";

import {Button} from "@/shared/ui/button";
import {Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle} from "@/shared/ui/drawer";
import {Save, X} from "lucide-react";
import {forwardRef, useImperativeHandle, useState} from "react";
import {FormProvider} from "react-hook-form";
import {useCategoryForm} from "./model/useCategoryForm";
import {useCategoryFormHandlers} from "./model/useCategoryFormHandlers";
import {CategoryFormFields} from "./ui/CategoryFormFields";

export type CategoryFormDrawerRef = {
  openDrawer: (id?: string) => void;
  closeDrawer: () => void;
};

const CategoryFormDrawer = forwardRef<CategoryFormDrawerRef>((_, ref) => {
  const form = useCategoryForm();
  const id = form.watch("id");
  const {handleSave, handleDelete, handleInit} = useCategoryFormHandlers(form);

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
      <DrawerContent className="h-[100vh] transition-all">
        <FormProvider {...form}>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>{id ? "Редактирование" : "Новая категория"}</DrawerTitle>
            </DrawerHeader>

            <div className="p-4 pb-0 flex flex-col gap-2">
              <CategoryFormFields />
            </div>

            <DrawerFooter className={"mt-50"}>
              <DrawerClose asChild>
                <Button onClick={handleSave} disabled={!form.formState.isValid}>
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

export default CategoryFormDrawer;
