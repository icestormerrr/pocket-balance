import {expect, it, jest} from "@jest/globals";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {useState} from "react";

import {SegmentInput, SegmentItem, SegmentList} from "../segment-input";

jest.mock("../segment-input.module.css", () => ({}));
jest.mock("../surface/surface.module.css", () => ({}));

const options = [
  {label: "Системная", value: "system"},
  {label: "Светлая", value: "light"},
  {label: "Тёмная", value: "dark"},
];

it("changes the selected value with the keyboard and follows controlled updates", async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  const {rerender} = render(<SegmentInput value="system" onChange={onChange} options={options} />);
  await user.tab();
  await user.keyboard("{ArrowRight}");
  expect(onChange).toHaveBeenLastCalledWith("light");

  rerender(<SegmentInput value="light" onChange={onChange} options={options} />);
  expect(screen.getByRole("tab", {name: "Светлая", selected: true})).toBeTruthy();
});

it("calls onChange once for a click and prevents selecting a disabled option", async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  function ControlledInput() {
    const [value, setValue] = useState("system");
    return (
      <SegmentInput
        value={value}
        onChange={nextValue => {
          setValue(nextValue);
          onChange(nextValue);
        }}
        options={options.map(option => ({...option, disabled: option.value === "dark"}))}
      />
    );
  }
  render(<ControlledInput />);
  await user.click(screen.getByRole("tab", {name: "Светлая"}));
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith("light");
  await user.click(screen.getByRole("tab", {name: "Тёмная"}));
  expect(onChange).toHaveBeenCalledTimes(1);
});

it("preserves navigation links when composing segments", () => {
  render(
    <SegmentList size="lg">
      <SegmentItem active asChild>
        <a href="/accounts" aria-current="page">
          Счета
        </a>
      </SegmentItem>
    </SegmentList>
  );
  expect(screen.getByRole("link", {name: "Счета"}).getAttribute("href")).toBe("/accounts");
  expect(screen.queryByRole("button")).toBeNull();
});
