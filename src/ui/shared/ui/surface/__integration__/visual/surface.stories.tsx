import type {Meta, StoryObj} from "@storybook/react-vite";

import {Surface} from "../..";

const meta = {
  title: "Shared/Surface",
  component: Surface,
  args: {
    children: "Surface content",
    padding: "l",
  },
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    Story => (
      <div className="p-l">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Muted: Story = {args: {variant: "muted"}};
export const Glass: Story = {args: {variant: "glass"}};

export const VisualProperties: Story = {
  render: () => (
    <div className="flex flex-col gap-2xl" data-testid="surface-comparison">
      <section className="flex flex-col gap-m" aria-labelledby="variants-title">
        <h2 id="variants-title" className="text-sm font-semibold">
          Variants
        </h2>
        <p className="text-sm text-muted-foreground">
          Each variant defines its background, border, shadow and blur together.
        </p>
        <div
          className="grid gap-l rounded-xl p-xl"
          style={{
            backgroundColor: "var(--muted)",
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent, transparent 12px, var(--border) 12px, var(--border) 24px)",
          }}
        >
          {(["default", "muted", "glass"] as const).map(variant => (
            <Surface key={variant} variant={variant} padding="l">
              {variant}
            </Surface>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-m" aria-labelledby="shape-title">
        <h2 id="shape-title" className="text-sm font-semibold">
          Radius / padding
        </h2>
        <Surface variant="muted" radius="s" padding="s">
          s / s
        </Surface>
        <Surface variant="glass" radius="xl" padding="xl">
          xl / xl
        </Surface>
      </section>
    </div>
  ),
};
