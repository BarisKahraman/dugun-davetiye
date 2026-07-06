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
    // Apps Script Web App CORS quirk: text/plain header ile OPTIONS preflight atlanır,
    // body içeriği yine JSON. Script tarafında e.postData.contents ile okunur.
    const response = await fetch(webhookUrl(), {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(input),
      redirect: "follow"
    });

    if (!response.ok) {
      throw new Error("Gönderim sırasında bir sorun oluştu.");
    }

    const payload = (await response.json()) as { ok: boolean; id?: string; message?: string };
    if (!payload.ok) {
      throw new Error(payload.message ?? "Gönderim başarısız.");
    }

    return {
      ok: true,
      id: payload.id ?? crypto.randomUUID(),
      message:
        payload.message ??
        (input.attendance === "attending"
          ? weddingConfig.copy.rsvpPositiveThanks
          : weddingConfig.copy.rsvpNegativeThanks)
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
