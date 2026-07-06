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

const SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbx50BbI9R2kigiI1mHN002EhuXeUT7pKQY_Br2gM4Ovc4VqYtIG-l_zal4ksnmgC-Jp/exec";

export const googleSheetsAdapter: WeddingDataAdapter = {
  submitRsvp(input: RsvpFormInput): Promise<RsvpResult> {
    const url = new URL(SHEETS_URL);
    url.searchParams.set("fullName", input.fullName);
    url.searchParams.set("phone", input.phone);
    url.searchParams.set("attendance", input.attendance);
    url.searchParams.set("guestCount", String(input.guestCount ?? ""));
    url.searchParams.set("accommodationNeed", input.accommodationNeed ?? "");
    url.searchParams.set("message", input.message ?? "");
    url.searchParams.set("songTitle", input.songTitle ?? "");
    url.searchParams.set("songArtist", input.songArtist ?? "");
    url.searchParams.set("honey", input.honey ?? "");
    url.searchParams.set("_t", String(Date.now()));

    // Fire-and-forget: arka planda yazar, kullanıcıyı bekletmez.
    // try-catch: kurumsal proxy window.fetch'i senkron throw eden bir wrapper ile
    // değiştirebilir; bu durumda .catch() yakalamaz, try-catch yakalar.
    try {
      fetch(url.toString(), { method: "GET", mode: "no-cors" }).catch(() => undefined);
    } catch {
      // network engeli — veri gitmeyebilir ama başarı paneli gösterilir
    }

    const message =
      input.attendance === "attending"
        ? weddingConfig.copy.rsvpPositiveThanks
        : weddingConfig.copy.rsvpNegativeThanks;

    return Promise.resolve({ ok: true, id: crypto.randomUUID(), message });
  },

  track(_metric: AnalyticsMetric): Promise<void> {
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
