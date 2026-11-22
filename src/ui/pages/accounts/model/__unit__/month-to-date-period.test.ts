import {expect, it} from "@jest/globals";

import {getMonthToDatePeriod} from "../month-to-date-period";

it.each([new Date(2025, 2, 15, 12), new Date(2025, 0, 1, 0), new Date(2024, 1, 29, 23)])(
  "includes the current local month up to the end of %s",
  date => {
    const period = getMonthToDatePeriod(date);
    expect(new Date(period.startDate)).toEqual(new Date(date.getFullYear(), date.getMonth(), 1));
    expect(new Date(period.endDate)).toEqual(
      new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
    );
  }
);
