import { weddingConfig } from "../config/wedding";
import type {
  AdminDashboard,
  AdminRsvp,
  AnalyticsMetric,
  GuestbookEntry,
  RsvpFormInput,
  RsvpResult,
  ScheduleItem
} from "../types/wedding";
import type { AdminSettingUpdate, WeddingDataAdapter } from "./dataAdapter";

const rsvpKey = "nb-wedding-rsvps";
const guestbookKey = "nb-wedding-guestbook";
const scheduleKey = "nb-wedding-schedule";

function readJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function storedSchedule(): ScheduleItem[] {
  return readJson<ScheduleItem[]>(scheduleKey, weddingConfig.schedule);
}

function dashboardFromStorage(): AdminDashboard {
  const rsvps = readJson<AdminRsvp[]>(rsvpKey, []);
  const guestbook = readJson<GuestbookEntry[]>(guestbookKey, []);
  const attending = rsvps.filter((rsvp) => rsvp.attendance === "attending");
  const notAttending = rsvps.filter((rsvp) => rsvp.attendance === "not_attending");
  const dailyCounts = rsvps.reduce<Record<string, number>>((acc, rsvp) => {
    const day = rsvp.createdAt.slice(0, 10);
    acc[day] = (acc[day] ?? 0) + 1;
    return acc;
  }, {});

  return {
    totals: {
      rsvpCount: rsvps.length,
      attendingCount: attending.length,
      notAttendingCount: notAttending.length,
      guestCount: attending.reduce((total, rsvp) => total + rsvp.guestCount, 0)
    },
    dailyRsvps: Object.entries(dailyCounts).map(([date, count]) => ({ date, count })),
    accommodationNeeds: attending.filter((rsvp) => rsvp.accommodationNeed === "yes"),
    rsvps,
    guestbook,
    songs: rsvps
      .filter((rsvp) => rsvp.songTitle)
      .map((rsvp) => ({
        title: rsvp.songTitle ?? "",
        artist: rsvp.songArtist,
        fullName: rsvp.fullName
      })),
    schedule: storedSchedule()
  };
}

export const mockAdapter: WeddingDataAdapter = {
  async submitRsvp(input: RsvpFormInput): Promise<RsvpResult> {
    const rsvps = readJson<AdminRsvp[]>(rsvpKey, []);
    const now = new Date().toISOString();
    const row: AdminRsvp = {
      id: crypto.randomUUID(),
      createdAt: now,
      fullName: input.fullName,
      phone: input.phone,
      attendance: input.attendance,
      guestCount: input.attendance === "attending" ? input.guestCount ?? 1 : 0,
      accommodationNeed: input.accommodationNeed,
      message: input.message,
      songTitle: input.songTitle,
      songArtist: input.songArtist
    };
    writeJson(rsvpKey, [row, ...rsvps]);

    if (input.message || input.songTitle) {
      const entries = readJson<GuestbookEntry[]>(guestbookKey, []);
      writeJson(guestbookKey, [
        {
          id: row.id,
          createdAt: now,
          fullName: input.fullName,
          note: input.message,
          songTitle: input.songTitle,
          songArtist: input.songArtist,
          approved: false
        },
        ...entries
      ]);
    }

    return {
      ok: true,
      id: row.id,
      message:
        input.attendance === "attending"
          ? weddingConfig.copy.rsvpPositiveThanks
          : weddingConfig.copy.rsvpNegativeThanks
    };
  },
  async track(metric: AnalyticsMetric): Promise<void> {
    void metric;
    return Promise.resolve();
  },
  async getAdminDashboard(): Promise<AdminDashboard> {
    return dashboardFromStorage();
  },
  async updateSetting(update: AdminSettingUpdate): Promise<void> {
    void update;
    return Promise.resolve();
  },
  async updateScheduleItem(item: Pick<ScheduleItem, "id" | "time" | "description">): Promise<void> {
    const schedule = storedSchedule().map((entry) =>
      entry.id === item.id
        ? {
            ...entry,
            time: item.time || undefined,
            description: item.description || entry.description
          }
        : entry
    );
    writeJson(scheduleKey, schedule);
  },
  async approveGuestbook(id: string, approved: boolean, displayedName: string | undefined): Promise<void> {
    const entries = readJson<GuestbookEntry[]>(guestbookKey, []);
    writeJson(
      guestbookKey,
      entries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              approved,
              displayedName
            }
          : entry
      )
    );
  }
};
