import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { HttpError, requireAdmin } from "./auth.js";
import { recordAnalytics, type AnalyticsMetric } from "./analytics.js";
import { notifyRsvp, sendDailySummary } from "./notifications.js";
import {
  appendGuestbook,
  appendRsvp,
  approveGuestbook,
  getAdminDashboard,
  isSheetConfigError,
  updateScheduleItem,
  updateSetting
} from "./sheets.js";
import { firstValidationMessage, rsvpSchema } from "./validation.js";

setGlobalOptions({
  region: "europe-west1",
  maxInstances: 10
});

type JsonRecord = Record<string, unknown>;
type RateBucket = {
  count: number;
  resetAt: number;
};

const rateBuckets = new Map<string, RateBucket>();
const allowedMetrics = new Set<AnalyticsMetric>(["pageViews", "rsvpStarted", "rsvpCompleted"]);

function bodyRecord(body: unknown): JsonRecord {
  if (typeof body === "object" && body !== null) {
    return body as JsonRecord;
  }
  return {};
}

function isRateLimited(key: string, limit: number): boolean {
  const now = Date.now();
  const current = rateBuckets.get(key);
  if (!current || current.resetAt < now) {
    rateBuckets.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }

  current.count += 1;
  return current.count > limit;
}

function routePath(path: string): string {
  const withoutApi = path.replace(/^\/api/, "");
  return withoutApi || "/";
}

function allowedOrigins(): string[] {
  return (process.env.CORS_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const api = onRequest(async (req, res) => {
  const origin = req.get("origin");
  const origins = allowedOrigins();
  if (origin && (origins.length === 0 || origins.includes(origin))) {
    res.set("Access-Control-Allow-Origin", origin);
    res.set("Vary", "Origin");
  }
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  const path = routePath(req.path || new URL(req.url, "https://local").pathname);

  try {
    if (path === "/rsvp" && req.method === "POST") {
      if (isRateLimited(req.ip ?? "anonymous", 8)) {
        res.status(429).json({ message: "Kısa süre içinde çok fazla deneme yapıldı." });
        return;
      }

      const parsed = rsvpSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ message: firstValidationMessage(parsed.error) });
        return;
      }

      if (parsed.data.honey) {
        res.json({
          ok: true,
          message: "Harika, notunuz bize ulaştı. 16 Ağustos’ta görüşmek üzere."
        });
        return;
      }

      await appendRsvp(parsed.data);
      await appendGuestbook(parsed.data);
      await recordAnalytics("rsvpCompleted").catch(() => undefined);
      await notifyRsvp(parsed.data).catch(() => undefined);
      res.json({
        ok: true,
        message:
          parsed.data.attendance === "attending"
            ? "Harika, notunuz bize ulaştı. 16 Ağustos’ta görüşmek üzere."
            : "Bize haber verdiğiniz için teşekkür ederiz. O gün sizi yanımızda hissedeceğiz."
      });
      return;
    }

    if (path === "/analytics" && req.method === "POST") {
      const metric = bodyRecord(req.body).metric;
      if (typeof metric === "string" && allowedMetrics.has(metric as AnalyticsMetric)) {
        await recordAnalytics(metric as AnalyticsMetric).catch(() => undefined);
      }
      res.json({ ok: true });
      return;
    }

    if (path === "/admin/dashboard" && req.method === "GET") {
      await requireAdmin(req.get("authorization"));
      res.json(await getAdminDashboard());
      return;
    }

    if (path === "/admin/settings" && req.method === "POST") {
      await requireAdmin(req.get("authorization"));
      const body = bodyRecord(req.body);
      if (typeof body.key !== "string" || typeof body.value !== "string") {
        res.status(400).json({ message: "Ayar bilgisi eksik." });
        return;
      }
      await updateSetting(body.key, body.value);
      res.json({ ok: true });
      return;
    }

    if (path === "/admin/schedule" && req.method === "POST") {
      await requireAdmin(req.get("authorization"));
      const body = bodyRecord(req.body);
      if (typeof body.id !== "string") {
        res.status(400).json({ message: "Program öğesi eksik." });
        return;
      }
      await updateScheduleItem(
        body.id,
        typeof body.time === "string" ? body.time : undefined,
        typeof body.description === "string" ? body.description : undefined
      );
      res.json({ ok: true });
      return;
    }

    if (path === "/admin/guestbook" && req.method === "POST") {
      await requireAdmin(req.get("authorization"));
      const body = bodyRecord(req.body);
      if (typeof body.id !== "string" || typeof body.approved !== "boolean") {
        res.status(400).json({ message: "Hatıra defteri bilgisi eksik." });
        return;
      }
      await approveGuestbook(
        body.id,
        body.approved,
        typeof body.displayedName === "string" ? body.displayedName : undefined
      );
      res.json({ ok: true });
      return;
    }

    res.status(404).json({ message: "Endpoint bulunamadı." });
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return;
    }

    if (isSheetConfigError(error)) {
      res.status(error.status).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "İstek işlenirken bir sorun oluştu." });
  }
});

export const dailySummary = onSchedule(
  {
    schedule: "0 18 * * *",
    timeZone: "Europe/Istanbul"
  },
  async () => {
    await sendDailySummary();
  }
);
