import type { SiteMode, WeddingConfig } from "../types/wedding";

const dayMs = 24 * 60 * 60 * 1000;

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

export type CountdownState = {
  mode: SiteMode;
  hasStartTime: boolean;
  days: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  label: string;
};

function numberPart(parts: Intl.DateTimeFormatPart[], type: string): number {
  const value = parts.find((part) => part.type === type)?.value;
  return Number(value ?? "0");
}

export function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const formatter = new Intl.DateTimeFormat("tr-TR", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });
  const parts = formatter.formatToParts(date);

  return {
    year: numberPart(parts, "year"),
    month: numberPart(parts, "month"),
    day: numberPart(parts, "day"),
    hour: numberPart(parts, "hour"),
    minute: numberPart(parts, "minute"),
    second: numberPart(parts, "second")
  };
}

function parseIsoDate(dateIso: string): Pick<ZonedParts, "year" | "month" | "day"> {
  const [year, month, day] = dateIso.split("-").map(Number);
  if (!year || !month || !day) {
    throw new Error(`Geçersiz tarih: ${dateIso}`);
  }
  return { year, month, day };
}

function parseTime(time?: string): Pick<ZonedParts, "hour" | "minute" | "second"> {
  if (!time) {
    return { hour: 0, minute: 0, second: 0 };
  }
  const [hour, minute] = time.split(":").map(Number);
  return { hour: hour ?? 0, minute: minute ?? 0, second: 0 };
}

function pseudoUtcMs(parts: ZonedParts): number {
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
}

function compareDateOnly(a: Pick<ZonedParts, "year" | "month" | "day">, b: Pick<ZonedParts, "year" | "month" | "day">): number {
  const aMs = Date.UTC(a.year, a.month - 1, a.day);
  const bMs = Date.UTC(b.year, b.month - 1, b.day);
  return aMs - bMs;
}

export function getWeddingMode(event: WeddingConfig["event"], now = new Date()): SiteMode {
  const today = getZonedParts(now, event.timezone);
  const eventDate = parseIsoDate(event.date);
  const diff = compareDateOnly(
    { year: today.year, month: today.month, day: today.day },
    eventDate
  );

  if (diff < 0) {
    return "before";
  }
  if (diff === 0) {
    return "day";
  }
  return "after";
}

export function daysUntilEventDate(event: WeddingConfig["event"], now = new Date()): number {
  const today = getZonedParts(now, event.timezone);
  const eventDate = parseIsoDate(event.date);
  const todayMs = Date.UTC(today.year, today.month - 1, today.day);
  const eventMs = Date.UTC(eventDate.year, eventDate.month - 1, eventDate.day);

  return Math.max(0, Math.ceil((eventMs - todayMs) / dayMs));
}

export function createCountdown(event: WeddingConfig["event"], now = new Date()): CountdownState {
  const mode = getWeddingMode(event, now);
  const hasStartTime = Boolean(event.startTime);

  if (mode === "day") {
    return {
      mode,
      hasStartTime,
      days: 0,
      label: "Bugün evleniyoruz"
    };
  }

  if (mode === "after") {
    return {
      mode,
      hasStartTime,
      days: 0,
      label: "Hatırası başladı"
    };
  }

  if (!event.startTime) {
    const days = daysUntilEventDate(event, now);
    return {
      mode,
      hasStartTime,
      days,
      label: `${days} gün`
    };
  }

  const eventDate = parseIsoDate(event.date);
  const eventTime = parseTime(event.startTime);
  const nowParts = getZonedParts(now, event.timezone);
  const diff = Math.max(
    0,
    pseudoUtcMs({ ...eventDate, ...eventTime }) - pseudoUtcMs(nowParts)
  );
  const days = Math.floor(diff / dayMs);
  const hours = Math.floor((diff % dayMs) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);

  return {
    mode,
    hasStartTime,
    days,
    hours,
    minutes,
    seconds,
    label: `${days} gün ${hours} saat ${minutes} dakika ${seconds} saniye`
  };
}

export function formatTurkishDate(dateIso: string): string {
  const { year, month, day } = parseIsoDate(dateIso);
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
