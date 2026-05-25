"use client";

import * as React from "react";
import {Drawer as DrawerPrimitive} from "vaul";

import {cn} from "@/shared/lib/styling";

function Drawer({...props}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({...props}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({...props}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({...props}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({className, ...props}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
}

type DrawerContentProps = React.ComponentProps<typeof DrawerPrimitive.Content> & {
  showHandle?: boolean;
  hideBar?: boolean;
};

function DrawerContent({className, children, hideBar, showHandle, ...props}: DrawerContentProps) {
  const shouldShowHandle = showHandle ?? !hideBar;

  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay className="bg-black/38 backdrop-blur-[2px]" />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          "group/drawer-content bg-background fixed z-50 flex h-auto flex-col shadow-2xl",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-20 data-[vaul-drawer-direction=bottom]:max-h-[88vh] data-[vaul-drawer-direction=bottom]:rounded-t-[2rem] data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
          className
        )}
        {...props}
      >
        {shouldShowHandle && (
          <div className="mx-auto mt-3 hidden h-1.5 w-11 shrink-0 rounded-full bg-foreground/12 group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        )}
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({className, ...props}: React.ComponentProps<"div">) {
  return <div data-slot="drawer-header" className={cn("flex flex-col gap-1.5 px-5 py-4", className)} {...props} />;
}

type DrawerFooterProps = React.ComponentProps<"div"> & {
  detached?: boolean;
};

function DrawerFooter({className, detached, ...props}: DrawerFooterProps) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "mt-auto flex flex-col gap-2 px-5 py-4",
        detached &&
          "border-t border-border/70 bg-background/92 backdrop-blur supports-[backdrop-filter]:bg-background/78 pb-[calc(1rem+env(safe-area-inset-bottom))]",
        className
      )}
      {...props}
    />
  );
}

function DrawerTitle({className, ...props}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-foreground text-[1.05rem] font-semibold tracking-[-0.02em]", className)}
      {...props}
    />
  );
}

function DrawerDescription({className, ...props}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
