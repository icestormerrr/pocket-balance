import {cn} from "@/shared/lib/styling";
import {Button} from "@/shared/ui/button";
import {Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/shared/ui/drawer";
import {Input} from "@/shared/ui/input";
import {ScrollArea} from "@/shared/ui/scroll-area";
import {ChevronsUpDown} from "lucide-react";
import {type ReactNode, useEffect, useMemo, useState} from "react";

export type Option = {
  label: string;
  value: string;
};

type SelectInputProps = {
  title?: string;
  options: Option[];
  value?: string;
  placeholder: string;
  onChange: (value: string | null, option: Option | null) => void;
  renderOption?: (option: Option) => ReactNode;
  className?: string;
};

export const SelectInput = ({
  title = "Выберите опцию",
  options,
  value,
  onChange,
  placeholder,
  renderOption,
  className,
}: SelectInputProps) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    return options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));
  }, [options, search]);

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const defaultRenderOption = (option: Option) => (
    <Button
      key={option.value}
      variant="ghost"
      onClick={() => {
        onChange(option.value, option);
        setOpen(false);
      }}
      className={cn("justify-start", value === option.value && "bg-muted text-primary hover:bg-muted")}
    >
      {option.label}
    </Button>
  );

  return (
    <Drawer open={open} onOpenChange={setOpen} repositionInputs={false}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between w-full", className)}
        >
          {value ? options.find(opt => opt.value === value)?.label : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh] max-w-lg mx-auto">
        <DrawerHeader className="px-4 pt-6">
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-4">
          <Input placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)} className="mb-4" />

          <ScrollArea className="h-[50vh] rounded-md border">
            <div className="flex flex-col gap-1 p-2">
              {filteredOptions.length === 0 ? (
                <div className="text-muted-foreground text-sm text-center py-6">Ничего не найдено</div>
              ) : (
                filteredOptions.map(renderOption ?? defaultRenderOption)
              )}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
