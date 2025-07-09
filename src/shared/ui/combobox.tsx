"use client";

import {Check, ChevronsUpDown} from "lucide-react";
import * as React from "react";

import {cn} from "@/shared/lib/styling";
import {Button} from "@/shared/ui/button";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/shared/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/shared/ui/popover";

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: {label: string; value: string}[];
  placeholder: string;
  noOptionsText?: string;
};

export function Combobox({value, onChange, options, placeholder, noOptionsText = "Ничего не найдено"}: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
          {value ? options.find(opt => opt.value === value)?.label : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{noOptionsText}</CommandEmpty>
            <CommandGroup>
              {options.map(opt => (
                <CommandItem
                  key={opt.value}
                  value={opt.value}
                  onSelect={currentValue => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                  <Check className={cn("ml-auto", value === opt.value ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
