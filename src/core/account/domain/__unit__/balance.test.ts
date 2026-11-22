import {describe, expect, it} from "@jest/globals";

import {calculateBalance} from "../balance";

describe("calculateBalance", () => {
  it.each([
    [{income: 30_000, expense: 4_500}, 25_500],
    [{income: 0, expense: 3_000}, -3_000],
    [{income: 1_000, expense: 1_000}, 0],
    [{income: 0, expense: 0}, 0],
    [{openingBalance: 82_450, income: 30_000, expense: 4_500}, 107_950],
  ])("calculates the balance from %o", (input, expected) => {
    expect(calculateBalance(input)).toBe(expected);
  });

  it("preserves fractional amounts", () => {
    expect(calculateBalance({income: 0.3, expense: 0.2})).toBeCloseTo(0.1);
  });
});
