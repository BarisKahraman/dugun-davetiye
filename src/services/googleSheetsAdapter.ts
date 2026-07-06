import { weddingConfig } from "../config/wedding";
import type {
  AdminDashboard,
  AnalyticsMetric,
  RsvpFormInput,
  RsvpResult,
  ScheduleItem
} from "../types/wedding";
import type { AdminSettingUpdate, WeddingDataAdapter } from "./dataAdapter";
import { mockAdapter } from "./mockAdapter";

function webhookUrl(): string {
  const url = import.meta.env.VITE_SHEETS_WEBHOOK_URL;
  if (!url) throw new Error("VITE_SHEETS_WEBHOOK_URL tanımlanmamış. .env dosyasına ekleyin.");
  return url;
}

export const googleSheetsAdapter: WeddingDataAdapter = {
  async submitRsvp(input: RsvpFormInput): Promise<RsvpResult> {
    // Apps Script POST redirect'te body'yi düşürür; doPost hiç çalışmaz.
    // GET + URL params güvenilir çalışır: Apps Script doGet(e) → e.parameter ile okur.
    const url = new URL(webhookUrl());
    url.searchParams.set("fullName", input.fullName);
    url.searchParams.set("phone", input.phone);
    url.searchParams.set("attendance", input.attendance);
    url.searchParams.set("guestCount", String(input.guestCount ?? ""));
    url.searchParams.set("accommodationNeed", input.accommodationNeed ?? "");
    url.searchParams.set("message", input.message ?? "");
    url.searchParams.set("songTitle", input.songTitle ?? "");
    url.searchParams.set("songArtist", input.songArtist ?? "");
    url.searchParams.set("honey", input.honey ?? "");
    // Cache'lenmemesi için timestamp
    url.searchParams.set("_t", String(Date.now()));

    await fetch(url.toString(), { method: "GET", mode: "no-cors" });

    return {
      ok: true,
      id: crypto.randomUUID(),
      message:
        input.attendance === "attending"
          ? weddingConfig.copy.rsvpPositiveThanks
          : weddingConfig.copy.rsvpNegativeThanks
    };
  },

  // Aşağıdakiler admin paneli için — Google Sheets yeterli olmadığından mock'a devreder.
  async track(_metric: AnalyticsMetric): Promise<void> {
    return Promise.resolve();
  },
  getAdminDashboard(token?: string): Promise<AdminDashboard> {
    return mockAdapter.getAdminDashboard(token);
  },
  updateSetting(update: AdminSettingUpdate, token?: string): Promise<void> {
    return mockAdapter.updateSetting(update, token);
  },
  updateScheduleItem(
    item: Pick<ScheduleItem, "id" | "time" | "description">,
    token?: string
  ): Promise<void> {
    return mockAdapter.updateScheduleItem(item, token);
  },
  approveGuestbook(
    id: string,
    approved: boolean,
    displayedName: string | undefined,
    token?: string
  ): Promise<void> {
    return mockAdapter.approveGuestbook(id, approved, displayedName, token);
  }
};
