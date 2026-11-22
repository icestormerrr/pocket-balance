import {Slot} from "@radix-ui/react-slot";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import type {ComponentProps, ReactNode} from "react";

import {cn} from "@/ui/shared/lib/styling";
import classNames from "./segment-input.module.css";
import {Surface} from "./surface";

type SegmentSize = "sm" | "md" | "lg";
type SegmentListProps = ComponentProps<"div"> & {size?: SegmentSize; asChild?: boolean};

function SegmentList({size = "md", className, ...props}: SegmentListProps) {
  return <Surface variant="glass" className={cn(classNames.segments, className)} data-size={size} {...props} />;
}

type SegmentItemProps = ComponentProps<"button"> & {active: boolean; asChild?: boolean};

function SegmentItem({active, asChild = false, className, ...props}: SegmentItemProps) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      type={asChild ? undefined : "button"}
      className={cn(classNames.item, className)}
      data-active={active}
      {...props}
    />
  );
}

type SegmentInputProps = {
  value: string;
  onChange: (value: string) => void;
  options: {label: ReactNode; value: string; disabled?: boolean}[];
  size?: SegmentSize;
  className?: string;
  "aria-label"?: string;
};

function SegmentInput({value, onChange, options, size, className, "aria-label": label}: SegmentInputProps) {
  return (
    <TabsPrimitive.Root value={value} onValueChange={onChange}>
      <SegmentList size={size} className={className} asChild>
        <TabsPrimitive.List aria-label={label}>
          {options.map(option => (
            <SegmentItem key={option.value} active={value === option.value} asChild>
              <TabsPrimitive.Trigger value={option.value} disabled={option.disabled}>
                {option.label}
              </TabsPrimitive.Trigger>
            </SegmentItem>
          ))}
        </TabsPrimitive.List>
      </SegmentList>
    </TabsPrimitive.Root>
  );
}

export {SegmentInput, SegmentItem, SegmentList};
export type {SegmentInputProps, SegmentSize};
