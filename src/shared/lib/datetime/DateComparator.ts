import dayjs from "dayjs";

export type DateUnit = "year" | "month" | "week" | "day" | "hour" | "minute" | "second" | "millisecond";

export class DateComparator {
  static isSame(date1: Date | string, date2: Date | string, unit: DateUnit = "millisecond"): boolean {
    return dayjs(date1).isSame(dayjs(date2), unit);
  }

  static isEqual(date1: Date | string, date2: Date | string): boolean {
    return dayjs(date1).valueOf() === dayjs(date2).valueOf();
  }

  static isBefore(date1: Date | string, date2: Date | string, unit: DateUnit = "millisecond"): boolean {
    return dayjs(date1).isBefore(dayjs(date2), unit);
  }

  static isAfter(date1: Date | string, date2: Date | string, unit: DateUnit = "millisecond"): boolean {
    return dayjs(date1).isAfter(dayjs(date2), unit);
  }

  static isBetweenOrEqual(
    target: Date | string,
    start: Date | string,
    end: Date | string,
    unit: DateUnit = "millisecond"
  ): boolean {
    const t = dayjs(target);
    const s = dayjs(start);
    const e = dayjs(end);

    return (t.isSame(s, unit) || t.isAfter(s, unit)) && (t.isSame(e, unit) || t.isBefore(e, unit));
  }

  static isBeforeOrEqual(date1: Date | string, date2: Date | string, unit: DateUnit = "millisecond"): boolean {
    return this.isBefore(date1, date2, unit) || this.isSame(date1, date2, unit);
  }

  static isAfterOrEqual(date1: Date | string, date2: Date | string, unit: DateUnit = "millisecond"): boolean {
    return this.isAfter(date1, date2, unit) || this.isSame(date1, date2, unit);
  }

  static diff(date1: Date | string, date2: Date | string, unit: DateUnit = "millisecond"): number {
    return dayjs(date1).diff(dayjs(date2), unit);
  }
}
