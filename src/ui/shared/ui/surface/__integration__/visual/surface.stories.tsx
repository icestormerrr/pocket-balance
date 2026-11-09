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
  decorators: [Story => <div className="p-l"><Story /></div>],
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const VisualProperties: Story = {
  render: () => (
    <div className="flex flex-col gap-2xl" data-testid="surface-comparison">
      <section className="flex flex-col gap-m" aria-labelledby="tones-title">
        <h2 id="tones-title" className="text-sm font-semibold">Tone</h2>
        <p className="text-sm text-muted-foreground">Transparent reveals the patterned background.</p>
        <div
          className="grid gap-l rounded-xl p-xl"
          style={{
            backgroundColor: "var(--muted)",
            backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 12px, var(--border) 12px, var(--border) 24px)",
          }}
        >
          {(["base", "muted", "transparent"] as const).map(tone => (
            <Surface key={tone} tone={tone} border="subtle" padding="l">{tone}</Surface>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-m" aria-labelledby="elevation-title">
        <h2 id="elevation-title" className="text-sm font-semibold">Elevation</h2>
        <p className="text-sm text-muted-foreground">Same surface and background; only the shadow changes.</p>
        <div className="grid gap-2xl rounded-xl bg-muted p-2xl">
          {(["flat", "raised"] as const).map(elevation => (
            <Surface key={elevation} elevation={elevation} padding="l">{elevation}</Surface>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-m" aria-labelledby="shape-title">
        <h2 id="shape-title" className="text-sm font-semibold">Radius / padding / border</h2>
        <Surface tone="muted" radius="s" padding="s">s / s / none</Surface>
        <Surface radius="xl" padding="xl" border="subtle">xl / xl / subtle</Surface>
      </section>
    </div>
  ),
};
