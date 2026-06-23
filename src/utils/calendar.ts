import type { WeddingConfig } from "../types/wedding";
import { siteUrl } from "../config/wedding";

type CalendarLinks = {
  google: string;
  appleIcs: string;
  outlook: string;
};

function compactDateTime(dateIso: string, time: string): string {
  return `${dateIso.replace(/-/g, "")}T${time.replace(":", "")}00`;
}

function addHours(time: string, hours: number): string {
  const [hour = 0, minute = 0] = time.split(":").map(Number);
  const total = hour * 60 + minute + hours * 60;
  const nextHour = Math.floor(total / 60) % 24;
  const nextMinute = total % 60;
  return `${String(nextHour).padStart(2, "0")}:${String(nextMinute).padStart(2, "0")}`;
}

export function createCalendarLinks(config: WeddingConfig): CalendarLinks | undefined {
  const { event } = config;
  if (!event.startTime) {
    return undefined;
  }

  const endTime = event.endTime ?? addHours(event.startTime, 5);
  const start = compactDateTime(event.date, event.startTime);
  const end = compactDateTime(event.date, endTime);
  const title = "Nuray & Barış Düğünü";
  const details = `${config.copy.invitation}\n\n${siteUrl}`;
  const location = `${event.venueName}, ${event.address}`;
  const google = new URL("https://calendar.google.com/calendar/render");
  google.searchParams.set("action", "TEMPLATE");
  google.searchParams.set("text", title);
  google.searchParams.set("dates", `${start}/${end}`);
  google.searchParams.set("ctz", event.timezone);
  google.searchParams.set("details", details);
  google.searchParams.set("location", location);

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nuray Baris Wedding//TR",
    "BEGIN:VEVENT",
    `UID:nuray-baris-${event.date}@nuraybarisevleniyooooooor.com`,
    `DTSTAMP:${compactDateTime(event.date, event.startTime)}Z`,
    `DTSTART;TZID=${event.timezone}:${start}`,
    `DTEND;TZID=${event.timezone}:${end}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${details.replace(/\n/g, "\\n")}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const outlook = new URL("https://outlook.live.com/calendar/0/action/compose");
  outlook.searchParams.set("path", "/calendar/action/compose");
  outlook.searchParams.set("rru", "addevent");
  outlook.searchParams.set("subject", title);
  outlook.searchParams.set("startdt", start);
  outlook.searchParams.set("enddt", end);
  outlook.searchParams.set("body", details);
  outlook.searchParams.set("location", location);

  return {
    google: google.toString(),
    appleIcs: `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`,
    outlook: outlook.toString()
  };
}
