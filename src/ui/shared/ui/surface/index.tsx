import {cva, type VariantProps} from "class-variance-authority";
import * as React from "react";

import {cn} from "@/ui/shared/lib/styling";

const surfaceVariants = cva("text-foreground", {
  variants: {
    tone: {
      base: "bg-background",
      muted: "bg-muted",
      transparent: "bg-transparent",
    },
    border: {
      none: "border-0",
      subtle: "border border-border/70",
    },
    elevation: {
      flat: "shadow-none",
      raised: "shadow-lg shadow-black/30",
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
    tone: "base",
    border: "none",
    elevation: "flat",
    radius: "m",
    padding: "none",
  },
});

type SurfaceProps = React.ComponentProps<"div"> & VariantProps<typeof surfaceVariants>;

function Surface({className, tone, border, elevation, radius, padding, ...props}: SurfaceProps) {
  return (
    <div
      data-slot="surface"
      className={cn(surfaceVariants({tone, border, elevation, radius, padding}), className)}
      {...props}
    />
  );
}

export {Surface};
export type {SurfaceProps};
