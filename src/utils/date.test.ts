import { describe, expect, it } from "vitest";
import type { WeddingConfig } from "../types/wedding";
import { createCountdown, daysUntilEventDate, getWeddingMode } from "./date";

const event: WeddingConfig["event"] = {
  date: "2026-08-16",
  timezone: "Europe/Istanbul",
  venueName: "Değirmenci Düğün Salonu",
  address: "Gökpınar, 07700 Elmalı / Antalya",
  city: "Elmalı / Antalya",
  childrenInvited: true
};

describe("wedding date helpers", () => {
  it("calculates remaining days in Europe/Istanbul when start time is missing", () => {
    const now = new Date("2026-06-18T09:00:00Z");

    expect(daysUntilEventDate(event, now)).toBe(59);
    expect(createCountdown(event, now)).toMatchObject({
      mode: "before",
      hasStartTime: false,
      days: 59,
      label: "59 gün"
    });
  });

  it("switches to day mode on the wedding date", () => {
    const now = new Date("2026-08-16T08:00:00Z");

    expect(getWeddingMode(event, now)).toBe("day");
    expect(createCountdown(event, now).label).toBe("Bugün evleniyoruz");
  });

  it("switches to after mode after the wedding date", () => {
    const now = new Date("2026-08-17T05:00:00Z");

    expect(getWeddingMode(event, now)).toBe("after");
  });

  it("calculates hours and minutes when start time exists", () => {
    const timedEvent = { ...event, startTime: "20:00" };
    const now = new Date("2026-08-15T17:30:00Z");

    expect(createCountdown(timedEvent, now)).toMatchObject({
      mode: "before",
      hasStartTime: true,
      days: 0,
      hours: 23,
      minutes: 30
    });
  });
});
