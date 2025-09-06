import {DateConverter} from "@/shared/lib/datetime";
import {cn} from "@/shared/lib/styling";
import {Button} from "@/shared/ui/button";
import {Calendar} from "@/shared/ui/calendar";
import {Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/shared/ui/drawer";
import {CalendarIcon} from "lucide-react";
import {useMemo} from "react";

type Props = {
  title?: string;
  placeholder?: string;
  className?: string;
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
}: SingleModeProps | RangeModeProps) {
  const dateLabel = useMemo(() => {
    if (!value) return placeholder;

    if (mode === "range") {
      return `${DateConverter.dateToFormattedString(value.from, "DD.MM.YYYY")} - ${DateConverter.dateToFormattedString(value.to, "DD.MM.YYYY")}`;
    }

    return DateConverter.dateToFormattedString(value, "DD.MM.YYYY");
  }, [mode, placeholder, value]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(`justify-start text-left font-normal`, !value && "text-muted-foreground", className)}
        >
          <CalendarIcon />
          {dateLabel}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="px-4 pb-4">
        <DrawerHeader className="px-0 py-4">
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        {/* @ts-expect-error необходимо сужение типов в зависимости от mode */}
        <Calendar mode={mode} selected={value} onSelect={onChange} className="rounded-lg border w-full" />
      </DrawerContent>
    </Drawer>
  );
}
