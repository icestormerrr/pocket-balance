import {cn} from "@/shared/lib/styling";
import * as React from "react";
import {useEffect, useState} from "react";

type Props = React.ComponentProps<"input"> & {
  preventMobileScrollOnFocus?: boolean;
};

function Input({className, onFocus, preventMobileScrollOnFocus = false, type, ...props}: Props) {
  const handleFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    onFocus?.(e);

    if (!preventMobileScrollOnFocus) return;
    const input = e.target;
    if (input) {
      input.style.opacity = "0";
      setTimeout(() => (input.style.opacity = "1"));
    }
  };

  return (
    <input
      {...props}
      type={type}
      onFocus={handleFocus}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
    />
  );
}

type NumericInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> & {
  value?: number;
  onChange: (value?: number) => void;
  mode?: "integer" | "float";
  allowNegative?: boolean;
  preventMobileScrollOnFocus?: boolean;
};

function NumericInput({
  className,
  onFocus,
  value,
  onChange,
  preventMobileScrollOnFocus = false,
  mode = "integer",
  allowNegative = false,
  ...props
}: NumericInputProps) {
  const [internalValue, setInternalValue] = useState(value !== undefined ? String(value) : "");

  useEffect(() => {
    setInternalValue(value !== undefined ? String(value) : "");
  }, [value]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    onFocus?.(e);
    if (!preventMobileScrollOnFocus) return;

    const input = e.target;
    input.style.opacity = "0";
    setTimeout(() => {
      input.style.opacity = "1";
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const floatRegex = allowNegative ? /^-?\d*(\.\d*)?$/ : /^\d*(\.\d*)?$/;
    const intRegex = allowNegative ? /^-?\d*$/ : /^\d*$/;
    const regex = mode === "float" ? floatRegex : intRegex;

    if (raw === "" || regex.test(raw)) {
      setInternalValue(raw);
      const parsed = raw === "-" || raw === "." || raw === "-." ? undefined : Number(raw);
      if (!isNaN(parsed!)) {
        onChange?.(parsed);
      } else {
        onChange?.(undefined);
      }
    }
  };

  return (
    <input
      {...props}
      inputMode="decimal"
      pattern={mode === "integer" ? "[0-9]*" : "[0-9]*[.,]?[0-9]*"}
      value={internalValue}
      onChange={handleChange}
      onFocus={handleFocus}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
    />
  );
}

export {Input, NumericInput};
