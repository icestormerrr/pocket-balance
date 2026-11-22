import {expect, it, jest} from "@jest/globals";
import {fireEvent, render, screen} from "@testing-library/react";

import {DrawerCloseButton} from "../drawer-close-button";

jest.mock("../drawer-close-button.module.css", () => ({}));
jest.mock("../surface/surface.module.css", () => ({}));

it("requests closing through its accessible button", () => {
  const onClick = jest.fn();
  render(<DrawerCloseButton onClick={onClick} />);

  fireEvent.click(screen.getByRole("button", {name: "Закрыть"}));

  expect(onClick).toHaveBeenCalledTimes(1);
});
