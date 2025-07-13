import {zodResolver} from "@hookform/resolvers/zod";
import {type FC, memo, useCallback, useEffect} from "react";
import {FormProvider, useForm} from "react-hook-form";

import {useCategory} from "@/entities/category";
import {Drawer, DrawerContent} from "@/shared/ui/drawer";

import {type CategoryFormState, categorySchema} from "./model/schema";
import {CategoryFormFields} from "./ui/components/CategoryFormFields/CategoryFormFields";
import {CreateButton} from "./ui/components/CreateButton/CreateButton";
import {DeleteButton} from "./ui/components/DeleteButton/DeleteButton";
import {UpdateButton} from "./ui/components/UpdateButton/UpdateButton";

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

  const handleSuccessButtonClick = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <FormProvider {...form}>
      <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={false}>
        <DrawerContent className="h-[100vh] transition-all">
          <div className="mx-auto w-full max-w-sm p-4 pt-0">
            <CategoryFormFields />

            <div className={"mt-4 flex justify-between"}>
              {id ? (
                <>
                  <div className="basis-[10%]">
                    <DeleteButton onSuccess={handleSuccessButtonClick} />
                  </div>
                  <div className="basis-[85%]">
                    <UpdateButton onSuccess={handleSuccessButtonClick} />
                  </div>
                </>
              ) : (
                <div className="basis-[100%]">
                  <CreateButton onSuccess={handleSuccessButtonClick} />
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </FormProvider>
  );
});

CategoryFormDrawer.displayName = "CategoryFormDrawer";

export default CategoryFormDrawer;
