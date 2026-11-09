import {afterEach, beforeEach, describe, expect, it, jest} from "@jest/globals";

import {getCreationDefaults, getRecentCategoryIds, saveRecentCategory} from "../creationPreferences";

const storage = new Map<string, string>();

describe("creation preferences", () => {
  beforeEach(() => {
    storage.clear();
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(key => storage.get(key) ?? null);
    jest.spyOn(Storage.prototype, "setItem").mockImplementation((key, value) => {
      storage.set(key, value);
    });
    jest.useFakeTimers().setSystemTime(new Date("2026-10-04T12:00:00+03:00"));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("uses saved account and date only during their local calendar day", () => {
    storage.set(
      "transaction-creation-defaults",
      JSON.stringify({day: "2026-10-04", accountId: "account-main", date: "2026-10-04T09:30:00+03:00"})
    );

    expect(getCreationDefaults()).toEqual({accountId: "account-main", date: "2026-10-04T09:30:00+03:00"});

    jest.setSystemTime(new Date("2026-10-05T12:00:00+03:00"));

    expect(getCreationDefaults()).toMatchObject({accountId: ""});
    expect(getCreationDefaults().date).toContain("2026-10-05");
  });

  it("moves a created category to the front, removes duplicates, caps each type at five, and preserves the other type", () => {
    storage.set(
      "transaction-recent-categories",
      JSON.stringify({
        expense: ["food", "coffee", "transport", "home", "health"],
        income: ["salary"],
      })
    );

    saveRecentCategory("expense", "leisure");
    saveRecentCategory("expense", "transport");

    expect(getRecentCategoryIds("expense")).toEqual(["transport", "leisure", "food", "coffee", "home"]);
    expect(getRecentCategoryIds("income")).toEqual(["salary"]);
  });
});
