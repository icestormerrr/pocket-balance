import {type ReactNode, useEffect, useMemo, useState} from "react";
import {Check, ChevronsUpDown} from "lucide-react";

import {cn} from "@/shared/lib/styling";
import {Button} from "@/shared/ui/button";
import {Card} from "@/shared/ui/card";
import {Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/shared/ui/drawer";
import {Input} from "@/shared/ui/input";

export type Option = {
  label: string;
  value: string;
};

type SelectMobileProps = {
  title?: string;
  options: Option[];
  value?: string | null;
  placeholder?: string;
  onChange: (value: string | null, option: Option | null) => void;
  renderField?: (props: FieldProps) => ReactNode;
  renderOption?: (option: Option) => ReactNode;
  className?: string;
  hideSearch?: boolean;
};

export const SelectMobile = ({
  title = "Выберите опцию",
  options,
  value,
  onChange,
  placeholder,
  renderField,
  renderOption,
  className,
  hideSearch,
}: SelectMobileProps) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    return options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));
  }, [options, search]);

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const handleOptionClick = (option: Option) => {
    onChange(option.value !== value ? option.value : null, option);
    setOpen(false);
  };

  const defaultRenderOption = (option: Option) => (
    <Button
      variant="ghost"
      className={cn(
        "h-14 w-full justify-between rounded-2xl px-4 text-left hover:bg-accent/70",
        value === option.value && "bg-accent text-foreground hover:bg-accent"
      )}
    >
      <span className="truncate">{option.label}</span>
      {value === option.value && <Check className="text-primary" />}
    </Button>
  );

  return (
    <Drawer open={open} onOpenChange={setOpen} repositionInputs={false}>
      <DrawerTrigger asChild>
        {renderField
          ? renderField({className, value, placeholder, options})
          : renderDefaultField({className, value, placeholder, options})}
      </DrawerTrigger>

      <DrawerContent className="mx-auto max-h-[82vh] max-w-lg">
        <DrawerHeader className="px-5 pb-3 pt-5">
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>

        <div className="px-5 pb-5">
          {!hideSearch && (
            <Input
              placeholder="Поиск..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="mb-4 h-11 rounded-2xl border-border/70 bg-muted/40 px-4 shadow-none"
            />
          )}

          <Card className="min-h-[250px] max-h-[58vh] overflow-auto rounded-[1.5rem] border-border/70 bg-muted/20 p-2 shadow-none">
            <div className="flex flex-col gap-1">
              {filteredOptions.length === 0 ? (
                <div className="text-muted-foreground py-10 text-center text-sm">Ничего не найдено</div>
              ) : (
                filteredOptions.map(opt => (
                  <div onClick={() => handleOptionClick(opt)} className="w-full" key={opt.value}>
                    {renderOption ? renderOption(opt) : defaultRenderOption(opt)}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

type FieldProps = {
  className?: string;
  value?: string | null;
  placeholder?: string;
  options: Option[];
};

function renderDefaultField({className, value, placeholder, options}: FieldProps): ReactNode {
  return (
    <Button variant="outline" role="combobox" className={cn("w-full justify-between rounded-2xl", className)}>
      <span className="truncate">{value ? options.find(opt => opt.value === value)?.label : placeholder}</span>
      <ChevronsUpDown className="opacity-50" />
    </Button>
  );
}
