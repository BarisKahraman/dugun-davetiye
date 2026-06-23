import type {
  AdminDashboard,
  AnalyticsMetric,
  RsvpFormInput,
  RsvpResult,
  ScheduleItem
} from "../types/wedding";
import { mockAdapter } from "./mockAdapter";
import { productionAdapter } from "./productionAdapter";

export type AdminSettingUpdate = {
  key: string;
  value: string;
};

export type WeddingDataAdapter = {
  submitRsvp(input: RsvpFormInput): Promise<RsvpResult>;
  track(metric: AnalyticsMetric): Promise<void>;
  getAdminDashboard(token?: string): Promise<AdminDashboard>;
  updateSetting(update: AdminSettingUpdate, token?: string): Promise<void>;
  updateScheduleItem(item: Pick<ScheduleItem, "id" | "time" | "description">, token?: string): Promise<void>;
  approveGuestbook(id: string, approved: boolean, displayedName: string | undefined, token?: string): Promise<void>;
};

export function isProductionMode(): boolean {
  return import.meta.env.VITE_DATA_MODE === "production";
}

export const weddingDataAdapter: WeddingDataAdapter = isProductionMode()
  ? productionAdapter
  : mockAdapter;
