import dayjs from "dayjs";

export function getMonthToDatePeriod(date: Date): {startDate: string; endDate: string} {
  return {
    startDate: dayjs(date).startOf("month").toISOString(),
    endDate: dayjs(date).endOf("day").toISOString(),
  };
}
