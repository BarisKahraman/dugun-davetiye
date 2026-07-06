import type {
  AdminDashboard,
  AnalyticsMetric,
  RsvpFormInput,
  RsvpResult,
  ScheduleItem
} from "../types/wedding";
import { googleSheetsAdapter } from "./googleSheetsAdapter";
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

type DataMode = "mock" | "sheets" | "production";

function getDataMode(): DataMode {
  const mode = import.meta.env.VITE_DATA_MODE;
  if (mode === "production") return "production";
  if (mode === "sheets") return "sheets";
  return "mock";
}

export function isProductionMode(): boolean {
  const mode = getDataMode();
  return mode === "production" || mode === "sheets";
}

const adapters: Record<DataMode, WeddingDataAdapter> = {
  mock: mockAdapter,
  sheets: googleSheetsAdapter,
  production: productionAdapter
};

export const weddingDataAdapter: WeddingDataAdapter = adapters[getDataMode()];
