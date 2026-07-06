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
    // Apps Script Web App POST isteklerini farklı bir domain'e redirect eder.
    // Bu redirect sırasında browser POST→GET'e dönüştürür; doPost hiç çağrılmaz.
    // Çözüm: no-cors modu — tarayıcı isteği gönderir, Apps Script çalışır,
    // ama response opaque döner (okunamaz). Bu yüzden optimistic success dönüyoruz.
    await fetch(webhookUrl(), {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(input)
    });

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
