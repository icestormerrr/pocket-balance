import dayjs from "dayjs";

export class DateCreator {
  static createPeriod(year: number, month?: number): {startDate: Date; endDate: Date} {
    if (month === undefined) {
      // Период — весь год
      const startDate = dayjs(new Date(year, 0, 1))
        .startOf("day")
        .toDate();
      const endDate = dayjs(new Date(year, 11, 31))
        .endOf("day")
        .toDate();
      return {startDate, endDate};
    } else {
      // Период — месяц в году
      const startDate = dayjs(new Date(year, month, 1))
        .startOf("day")
        .toDate();
      const endDate = dayjs(new Date(year, month, 1))
        .endOf("month")
        .endOf("day")
        .toDate();
      return {startDate, endDate};
    }
  }
}
