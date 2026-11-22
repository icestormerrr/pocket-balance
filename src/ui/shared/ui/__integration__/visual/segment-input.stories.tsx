import type {Meta, StoryObj} from "@storybook/react-vite";
import {useState} from "react";

import {SegmentInput, type SegmentSize} from "../../segment-input";

const options = [
  {value: "system", label: "Системная"},
  {value: "light", label: "Светлая"},
  {value: "dark", label: "Тёмная"},
];

function Example({size}: {size: SegmentSize}) {
  const [value, setValue] = useState("dark");
  return (
    <section data-testid={size} className="flex flex-col gap-3">
      <h2>{size}</h2>
      <SegmentInput size={size} value={value} onChange={setValue} options={options} aria-label={size} />
    </section>
  );
}

const meta = {
  title: "Shared/Segment Input",
  component: SegmentInput,
  args: {value: "dark", onChange: () => undefined, options},
  parameters: {layout: "fullscreen"},
} satisfies Meta<typeof SegmentInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-4">
      {(["sm", "md", "lg"] as const).map(size => (
        <Example key={size} size={size} />
      ))}
    </div>
  ),
};
