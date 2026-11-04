import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import * as React from "react";

import {cn} from "@/shared/lib/styling";

function ToggleGroup({className, ...props}: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    />
  );
}

function ToggleGroupItem({className, ...props}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        "inline-flex h-10 flex-1 items-center justify-center rounded-2xl border border-border/70 bg-background/35 px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-xs",
        className
      )}
      {...props}
    />
  );
}

export {ToggleGroup, ToggleGroupItem};
