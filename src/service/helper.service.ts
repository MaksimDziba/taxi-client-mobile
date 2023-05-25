export const dateToHoursMinutes = (date: Date): string => {
  if (!date || !(date instanceof Date)) {
    return "00:00";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    hour12: false,
    minute: "2-digit",
    hour: "2-digit",
  }).format(date);
};

export const dateToMoscow = (date: Date): string => {
  if (!date || !(date instanceof Date)) {
    return "00:00";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour12: false,
    minute: "2-digit",
    hour: "2-digit",
  }).format(date);
};
