import dayjs from "dayjs";

export class DateConverter {
  static dateToISO(date: Date | undefined): string {
    return date ? dayjs(date).format("YYYY-MM-DDTHH:mm:ssZ") : "";
  }

  static ISOToDate(isoString: string): Date {
    return dayjs(isoString).toDate();
  }

  static dateToFormattedString(date: Date | undefined, format: string): string {
    return dayjs(date).format(format);
  }

  static ISOToFormattedString(isoString: string, format: string): string {
    return dayjs(isoString).format(format);
  }
}
