import {ChevronsUpDown} from "lucide-react";
import {type ReactNode, useMemo, useState} from "react";

import {cn} from "@/ui/shared/lib/styling";
import {Button} from "@/ui/shared/ui/button";
import {Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/ui/shared/ui/drawer";
import {Input} from "@/ui/shared/ui/input";

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
  hideSearch = true,
}: SelectMobileProps) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    return options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));
  }, [options, search]);

  const handleOptionClick = (option: Option) => {
    onChange(option.value !== value ? option.value : null, option);
    setOpen(false);
  };

  const defaultRenderOption = (option: Option) => (
    <Button
      variant={value === option.value ? "secondary" : "outline"}
      className="h-14 w-full justify-start rounded-2xl px-4 text-left"
    >
      <span className="truncate">{option.label}</span>
    </Button>
  );

  return (
    <Drawer
      open={open}
      onOpenChange={nextOpen => {
        setOpen(nextOpen);
        if (!nextOpen) setSearch("");
      }}
      repositionInputs={false}
    >
      <DrawerTrigger asChild>
        {renderField
          ? renderField({className, value, placeholder, options})
          : renderDefaultField({className, value, placeholder, options})}
      </DrawerTrigger>

      <DrawerContent className="mx-auto max-h-[82vh] max-w-lg overflow-hidden">
        <DrawerHeader className="px-5 pt-5 pb-3">
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

          <div className="no-scrollbar max-h-[58vh] min-h-[250px] overflow-auto">
            <div className="flex flex-col gap-2">
              {filteredOptions.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">Ничего не найдено</div>
              ) : (
                filteredOptions.map(opt => (
                  <div onClick={() => handleOptionClick(opt)} className="w-full" key={opt.value}>
                    {renderOption ? renderOption(opt) : defaultRenderOption(opt)}
                  </div>
                ))
              )}
            </div>
          </div>
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
