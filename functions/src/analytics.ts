import { appendAnalyticsRow } from "./sheets.js";

export type AnalyticsMetric = "pageViews" | "rsvpStarted" | "rsvpCompleted";

export async function recordAnalytics(metric: AnalyticsMetric): Promise<void> {
  if (metric === "pageViews") {
    await appendAnalyticsRow(1, 0, 0);
  } else if (metric === "rsvpStarted") {
    await appendAnalyticsRow(0, 1, 0);
  } else {
    await appendAnalyticsRow(0, 0, 1);
  }
}
