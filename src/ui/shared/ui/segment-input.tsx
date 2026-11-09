import {Tabs, TabsList, TabsTrigger} from "@/ui/shared/ui/tabs";

function SegmentInput({
  value,
  onChange,
  options,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  options: {label: string; value: string}[];
  className?: string;
}) {
  return (
    <Tabs value={value}>
      <TabsList className={`w-full ${className}`}>
        {options.map(opt => (
          <TabsTrigger onClick={() => onChange(opt.value)} value={opt.value} key={opt.value}>
            {opt.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export {SegmentInput};
