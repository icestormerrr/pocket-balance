import {ChevronRight} from "lucide-react";
import type {ComponentProps, ReactNode} from "react";

import {cn} from "@/ui/shared/lib/styling";
import {Button} from "@/ui/shared/ui/button";

type DetailRowProps = Omit<ComponentProps<typeof Button>, "children" | "variant"> & {
  icon: ReactNode;
  label: string;
  value?: ReactNode;
};

function DetailRow({className, icon, label, value, ...props}: DetailRowProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className={cn("h-auto w-full justify-between rounded-[1.1rem] px-3 py-3 text-left", className)}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted" aria-hidden>
          {icon}
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-sm font-medium">{label}</span>
          {value && <span className="truncate text-xs text-muted-foreground">{value}</span>}
        </span>
      </span>
      <ChevronRight className="shrink-0 text-muted-foreground" />
    </Button>
  );
}

export {DetailRow};
