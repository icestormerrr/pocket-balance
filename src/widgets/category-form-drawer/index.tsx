import {zodResolver} from "@hookform/resolvers/zod";
import {X} from "lucide-react";
import {type FC, memo, useEffect} from "react";
import {FormProvider, useForm} from "react-hook-form";

import {useCategory} from "@/entities/category";
import {Button} from "@/shared/ui/button";
import {Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle} from "@/shared/ui/drawer";
import {type CategoryFormState, categorySchema} from "@/widgets/category-form-drawer/model/schema.ts";

import {CategoryFormFields} from "./ui/components/CategoryFormFields/CategoryFormFields.tsx";
import CreateButton from "./ui/components/CreateButton/CreateButton.tsx";
import DeleteButton from "./ui/components/DeleteButton/DeleteButton.tsx";
import UpdateButton from "./ui/components/UpdateButton/UpdateButton.tsx";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string | undefined;
};

const defaultValues: CategoryFormState = {type: "expense", id: "", name: "", color: ""};

const CategoryFormDrawer: FC<Props> = memo(({open, onOpenChange, categoryId}) => {
  const {refetch} = useCategory(categoryId);

  const form = useForm<CategoryFormState>({
    resolver: zodResolver(categorySchema),
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

  return (
    <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={false}>
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
              <DrawerClose asChild>{id ? <UpdateButton /> : <CreateButton />}</DrawerClose>
              <div className={"flex justify-between mt-2"}>
                <DrawerClose asChild>{id && <DeleteButton />}</DrawerClose>

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

CategoryFormDrawer.displayName = "CategoryFormDrawer";

export default CategoryFormDrawer;
