"use client";

import {cn} from "@/shared/lib/styling";
import {Button} from "@/shared/ui/button";
import {Calendar} from "@/shared/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/shared/ui/popover";
import {format} from "date-fns";
import {CalendarIcon} from "lucide-react";

type Props = {
  value: Date | undefined;
  onChange: (value: Date | undefined) => void;
  placeholder?: string;
  className?: string;
};

export function DatePicker({value, onChange, placeholder = "Выберите дату", className}: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(`justify-start text-left font-normal`, !value && "text-muted-foreground", className)}
        >
          <CalendarIcon />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
