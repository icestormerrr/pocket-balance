import {zodResolver} from "@hookform/resolvers/zod";
import {type FC, memo, useCallback, useEffect} from "react";
import {FormProvider, useForm} from "react-hook-form";

import {useCategory} from "@/entities/category";
import {getStatusBarHeight} from "@/shared/lib/styling";
import {Drawer, DrawerContent, DrawerFooter} from "@/shared/ui/drawer";

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

const defaultValues: CategoryFormState = {type: "expense", id: "", name: "", color: "", shortName: ""};

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
        form.reset({...query.data, shortName: query.data.shortName ?? ""});
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
            <CategoryFormFields />
          </div>

          <DrawerFooter className="px-0">
            <div className={"flex justify-between"}>
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
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </FormProvider>
  );
});

CategoryFormDrawer.displayName = "CategoryFormDrawer";

export default CategoryFormDrawer;
