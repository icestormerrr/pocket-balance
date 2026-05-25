import {type ReactNode, useMemo} from "react";
import {CalendarIcon} from "lucide-react";

import {DateConverter} from "@/shared/lib/datetime";
import {cn} from "@/shared/lib/styling";
import {Button} from "@/shared/ui/button";
import {Calendar} from "@/shared/ui/calendar";
import {Card} from "@/shared/ui/card";
import {Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/shared/ui/drawer";

type Props = {
  title?: string;
  placeholder?: string;
  className?: string;
  children?: ReactNode;
};

type RangeModeProps = Props & {
  value: {from: Date | undefined; to: Date | undefined} | undefined;
  onChange: (value: {from: Date | undefined; to: Date | undefined} | undefined) => void;
  mode: "range";
};

type SingleModeProps = Props & {
  value: Date | undefined;
  onChange: (value: Date | undefined) => void;
  mode: "single";
};

export function DatePickerMobile({
  value,
  onChange,
  placeholder = "Выберите дату",
  title = "Выберите дату",
  className,
  mode,
  children,
}: SingleModeProps | RangeModeProps) {
  const dateLabel = useMemo(() => {
    if (!value) return placeholder;

    if (mode === "range") {
      return `${DateConverter.dateToFormattedString(value.from, "DD.MM.YYYY")} - ${DateConverter.dateToFormattedString(value.to, "DD.MM.YYYY")}`;
    }

    return DateConverter.dateToFormattedString(value, "DD.MM.YYYY");
  }, [mode, placeholder, value]);

  return (
    <Drawer repositionInputs={false}>
      <DrawerTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            variant="outline"
            className={cn("justify-start rounded-2xl text-left font-normal", !value && "text-muted-foreground", className)}
          >
            <CalendarIcon />
            {dateLabel}
          </Button>
        )}
      </DrawerTrigger>

      <DrawerContent className="mx-auto min-h-[78vh] max-w-lg">
        <DrawerHeader className="px-5 pb-3 pt-5">
          <DrawerTitle>{title}</DrawerTitle>
          <p className="text-muted-foreground text-sm">{dateLabel}</p>
        </DrawerHeader>

        <div className="px-5 pb-4">
          <Card className="rounded-[1.75rem] border-border/70 bg-muted/20 p-3 shadow-none">
            {/* @ts-expect-error narrowing by mode is enough for runtime */}
            <Calendar mode={mode} selected={value} onSelect={onChange} className="w-full rounded-[1.25rem] border-0" />
          </Card>
        </div>

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
