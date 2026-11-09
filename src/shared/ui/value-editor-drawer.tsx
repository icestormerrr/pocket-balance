import type {ReactElement, ReactNode} from "react";

import {Button} from "@/shared/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/drawer";

type ValueEditorDrawerProps = {
  title: string;
  trigger: ReactElement;
  children: ReactNode;
};

function ValueEditorDrawer({title, trigger, children}: ValueEditorDrawerProps) {
  return (
    <Drawer repositionInputs={false}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="mx-auto h-[80dvh] max-w-lg">
        <DrawerHeader className="px-5 pt-5 pb-3">
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="px-5 pb-4">{children}</div>
        <DrawerFooter detached>
          <DrawerClose asChild>
            <Button size="lg" className="h-12 w-full rounded-2xl">
              Готово
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export {ValueEditorDrawer};
