import {Badge} from "@/shared/ui/badge";

function BadgeGroup<ValueType extends string | number>({
  value,
  onChange,
  options,
  className,
  enableScroll = false,
}: {
  value: ValueType | null | undefined;
  onChange: (value: ValueType | null) => void;
  options: {label: string; value: ValueType}[];
  className?: string;
  enableScroll?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 ${enableScroll ? "overflow-x-auto pb-2" : "flex-wrap"} ${className}`}>
      {options.map(opt => (
        <Badge
          key={opt.label}
          variant={value === opt.value ? "default" : "outline"}
          onClick={() => onChange(opt.value === value ? null : opt.value)}
          className="cursor-pointer"
        >
          {opt.label}
        </Badge>
      ))}
    </div>
  );
}

export {BadgeGroup};
