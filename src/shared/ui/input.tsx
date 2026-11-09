import {cn} from "@/shared/lib/styling";
import * as React from "react";

type InputSize = "sm" | "md" | "lg";

type Props = Omit<React.ComponentProps<"input">, "size"> & {
  inline?: boolean;
  size?: InputSize;
};

const INLINE_STYLES =
  "border-0 hover:border-0 focus-visible:ring-0 p-0 bg-transparent dark:bg-transparent shadow-none rounded-none";

const inputSizeClasses: Record<InputSize, string> = {
  sm: "h-9 px-3 py-1 text-base md:text-sm",
  md: "h-10 px-3 text-base md:text-sm",
  lg: "h-12 px-4 text-base",
};

function Input({className, type, inline = false, size = "sm", ...props}: Props) {
  return (
    <input
      {...props}
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        inputSizeClasses[size],
        className,
        inline ? INLINE_STYLES : ""
      )}
    />
  );
}

export {Input};
