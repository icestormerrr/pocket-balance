import type {CategoryType} from "@/ui/entities/category";
import {DateConverter} from "@/shared/lib/datetime";

const DEFAULTS_STORAGE_KEY = "transaction-creation-defaults";
const RECENT_CATEGORIES_STORAGE_KEY = "transaction-recent-categories";
const RECENT_CATEGORIES_LIMIT = 5;

type StoredDefaults = {
  day: string;
  accountId: string;
  date: string;
};

type StoredRecentCategories = Record<CategoryType, string[]>;

const getTodayKey = () => DateConverter.dateToFormattedString(new Date(), "YYYY-MM-DD");

const readStorage = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const writeStorage = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The form remains usable when storage is unavailable.
  }
};

export const getCreationDefaults = () => {
  const defaults = readStorage<StoredDefaults>(DEFAULTS_STORAGE_KEY);
  const today = getTodayKey();

  if (defaults?.day === today) {
    return {accountId: defaults.accountId, date: defaults.date};
  }

  return {accountId: "", date: DateConverter.dateToISO(new Date())};
};

export const saveCreationDefaults = ({accountId, date}: Pick<StoredDefaults, "accountId" | "date">) => {
  writeStorage<StoredDefaults>(DEFAULTS_STORAGE_KEY, {accountId, date, day: getTodayKey()});
};

export const getRecentCategoryIds = (type: CategoryType): string[] => {
  const recent = readStorage<Partial<StoredRecentCategories>>(RECENT_CATEGORIES_STORAGE_KEY);
  return recent?.[type] ?? [];
};

export const saveRecentCategory = (type: CategoryType, categoryId: string) => {
  const recent = readStorage<Partial<StoredRecentCategories>>(RECENT_CATEGORIES_STORAGE_KEY) ?? {};
  const categoryIds = [categoryId, ...(recent[type] ?? []).filter(id => id !== categoryId)].slice(
    0,
    RECENT_CATEGORIES_LIMIT
  );

  writeStorage<StoredRecentCategories>(RECENT_CATEGORIES_STORAGE_KEY, {
    expense: recent.expense ?? [],
    income: recent.income ?? [],
    [type]: categoryIds,
  });
};
