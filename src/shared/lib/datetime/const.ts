import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

export const months = [
  {label: "Янв", value: 0},
  {label: "Фев", value: 1},
  {label: "Мар", value: 2},
  {label: "Апр", value: 3},
  {label: "Май", value: 4},
  {label: "Июн", value: 5},
  {label: "Июл", value: 6},
  {label: "Авг", value: 7},
  {label: "Сен", value: 8},
  {label: "Окт", value: 9},
  {label: "Ноя", value: 10},
  {label: "Дек", value: 11},
];
