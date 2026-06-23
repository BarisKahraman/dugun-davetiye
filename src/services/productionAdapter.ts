import type {
  AdminDashboard,
  AnalyticsMetric,
  RsvpFormInput,
  RsvpResult,
  ScheduleItem
} from "../types/wedding";
import type { AdminSettingUpdate, WeddingDataAdapter } from "./dataAdapter";

function apiBase(): string {
  return import.meta.env.VITE_FUNCTIONS_BASE_URL?.replace(/\/$/, "") ?? "/api";
}

async function requestJson<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${apiBase()}${path}`, {
    ...init,
    headers
  });

  const payload = (await response.json().catch(() => ({}))) as { message?: string };
  if (!response.ok) {
    throw new Error(payload.message ?? "İstek tamamlanamadı.");
  }

  return payload as T;
}

export const productionAdapter: WeddingDataAdapter = {
  submitRsvp(input: RsvpFormInput): Promise<RsvpResult> {
    return requestJson<RsvpResult>("/rsvp", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },
  async track(metric: AnalyticsMetric): Promise<void> {
    await requestJson<{ ok: true }>("/analytics", {
      method: "POST",
      body: JSON.stringify({ metric })
    });
  },
  getAdminDashboard(token?: string): Promise<AdminDashboard> {
    return requestJson<AdminDashboard>("/admin/dashboard", { method: "GET" }, token);
  },
  async updateSetting(update: AdminSettingUpdate, token?: string): Promise<void> {
    await requestJson<{ ok: true }>("/admin/settings", {
      method: "POST",
      body: JSON.stringify(update)
    }, token);
  },
  async updateScheduleItem(
    item: Pick<ScheduleItem, "id" | "time" | "description">,
    token?: string
  ): Promise<void> {
    await requestJson<{ ok: true }>("/admin/schedule", {
      method: "POST",
      body: JSON.stringify(item)
    }, token);
  },
  async approveGuestbook(
    id: string,
    approved: boolean,
    displayedName: string | undefined,
    token?: string
  ): Promise<void> {
    await requestJson<{ ok: true }>("/admin/guestbook", {
      method: "POST",
      body: JSON.stringify({ id, approved, displayedName })
    }, token);
  }
};
