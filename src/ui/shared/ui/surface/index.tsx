import {Slot} from "@radix-ui/react-slot";
import {cva, type VariantProps} from "class-variance-authority";
import * as React from "react";

import {cn} from "@/ui/shared/lib/styling";
import classNames from "./surface.module.css";

const surfaceVariants = cva("text-foreground", {
  variants: {
    variant: {
      default: "border-0 bg-background shadow-none",
      muted: "border border-border/70 bg-muted shadow-none",
      glass: classNames.glass,
    },
    radius: {
      s: "rounded-[var(--radius-s)]",
      m: "rounded-[var(--radius-m)]",
      l: "rounded-[var(--radius-l)]",
      xl: "rounded-[var(--radius-xl)]",
    },
    padding: {
      none: "p-0",
      xs: "p-[var(--space-xs)]",
      s: "p-[var(--space-s)]",
      m: "p-[var(--space-m)]",
      l: "p-[var(--space-l)]",
      xl: "p-[var(--space-xl)]",
    },
  },
  defaultVariants: {
    variant: "default",
    radius: "m",
    padding: "none",
  },
});

type SurfaceProps = React.ComponentProps<"div"> &
  VariantProps<typeof surfaceVariants> & {
    asChild?: boolean;
  };

function Surface({className, variant, radius, padding, asChild = false, ...props}: SurfaceProps) {
  const Component = asChild ? Slot : "div";
  return (
    <Component data-slot="surface" className={cn(surfaceVariants({variant, radius, padding}), className)} {...props} />
  );
}

export {Surface};
export type {SurfaceProps};
