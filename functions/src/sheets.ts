import { google } from "googleapis";
import type { sheets_v4 } from "googleapis";
import type { AdminDashboard, AdminRsvp, GuestbookEntry, ScheduleItem } from "./types.js";
import { escapeSheetFormula, type RsvpInput } from "./validation.js";

type SheetObject = Record<string, string> & {
  _rowNumber: string;
};

class SheetConfigError extends Error {
  status = 503;
}

function spreadsheetId(): string {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) {
    throw new SheetConfigError("Google Sheet yapılandırması eksik.");
  }
  return id;
}

async function sheetsClient(): Promise<sheets_v4.Sheets> {
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });
  return google.sheets({ version: "v4", auth });
}

function cell(value: string | number | boolean | undefined): string | number | boolean {
  return escapeSheetFormula(value);
}

function toStringCell(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
}

async function appendRow(tab: string, values: Array<string | number | boolean | undefined>): Promise<void> {
  const sheets = await sheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId(),
    range: `${tab}!A:Z`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [values.map(cell)]
    }
  });
}

export async function readSheetObjects(tab: string): Promise<SheetObject[]> {
  const sheets = await sheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId(),
    range: `${tab}!A1:Z`
  });
  const rows = response.data.values ?? [];
  const headers = (rows[0] ?? []).map(toStringCell);

  return rows.slice(1).map((row, index) => {
    const object = headers.reduce<SheetObject>(
      (acc, header, columnIndex) => {
        acc[header] = toStringCell(row[columnIndex]);
        return acc;
      },
      { _rowNumber: String(index + 2) }
    );
    return object;
  });
}

export async function appendRsvp(input: RsvpInput): Promise<void> {
  await appendRow("RSVP", [
    new Date().toISOString(),
    input.fullName,
    input.phone,
    input.attendance,
    input.attendance === "attending" ? input.guestCount ?? 1 : 0,
    input.accommodationNeed ?? "",
    input.message ?? "",
    input.songTitle ?? "",
    input.songArtist ?? "",
    input.consent ? "true" : "false",
    "public-site"
  ]);
}

export async function appendGuestbook(input: RsvpInput): Promise<void> {
  if (!input.message && !input.songTitle) {
    return;
  }

  await appendRow("Guestbook", [
    new Date().toISOString(),
    input.fullName,
    input.message ?? "",
    input.songTitle ?? "",
    input.songArtist ?? "",
    "false",
    ""
  ]);
}

function parseRsvp(row: SheetObject): AdminRsvp {
  const attendance = row.attendance === "not_attending" ? "not_attending" : "attending";
  return {
    id: row._rowNumber,
    createdAt: row.createdAt,
    fullName: row.fullName,
    phone: row.phone,
    attendance,
    guestCount: Number(row.guestCount || 0),
    accommodationNeed:
      row.accommodationNeed === "yes" || row.accommodationNeed === "no" || row.accommodationNeed === "unsure"
        ? row.accommodationNeed
        : undefined,
    message: row.message || undefined,
    songTitle: row.songTitle || undefined,
    songArtist: row.songArtist || undefined
  };
}

function parseSchedule(row: SheetObject): ScheduleItem {
  return {
    id: row.id,
    order: Number(row.order || 0),
    title: row.title,
    time: row.time || undefined,
    description: row.description || undefined,
    enabled: row.enabled !== "false"
  };
}

function parseGuestbook(row: SheetObject): GuestbookEntry {
  return {
    id: row._rowNumber,
    createdAt: row.createdAt,
    fullName: row.fullName,
    note: row.note || undefined,
    songTitle: row.songTitle || undefined,
    songArtist: row.songArtist || undefined,
    approved: row.approved === "true",
    displayedName: row.displayedName || undefined
  };
}

export async function getAdminDashboard(): Promise<AdminDashboard> {
  const [rsvpRows, guestbookRows, scheduleRows] = await Promise.all([
    readSheetObjects("RSVP"),
    readSheetObjects("Guestbook"),
    readSheetObjects("Schedule")
  ]);
  const rsvps = rsvpRows.map(parseRsvp).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const attending = rsvps.filter((rsvp) => rsvp.attendance === "attending");
  const notAttending = rsvps.filter((rsvp) => rsvp.attendance === "not_attending");
  const daily = rsvps.reduce<Record<string, number>>((acc, rsvp) => {
    const date = rsvp.createdAt.slice(0, 10);
    acc[date] = (acc[date] ?? 0) + 1;
    return acc;
  }, {});

  return {
    totals: {
      rsvpCount: rsvps.length,
      attendingCount: attending.length,
      notAttendingCount: notAttending.length,
      guestCount: attending.reduce((total, rsvp) => total + rsvp.guestCount, 0)
    },
    dailyRsvps: Object.entries(daily).map(([date, count]) => ({ date, count })),
    accommodationNeeds: attending.filter((rsvp) => rsvp.accommodationNeed === "yes"),
    rsvps,
    guestbook: guestbookRows.map(parseGuestbook),
    songs: rsvps
      .filter((rsvp) => rsvp.songTitle)
      .map((rsvp) => ({
        title: rsvp.songTitle ?? "",
        artist: rsvp.songArtist,
        fullName: rsvp.fullName
      })),
    settingsSheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId()}/edit`,
    schedule: scheduleRows.map(parseSchedule).sort((a, b) => a.order - b.order)
  };
}

export async function updateSetting(key: string, value: string): Promise<void> {
  const sheets = await sheetsClient();
  const rows = await readSheetObjects("Settings");
  const row = rows.find((item) => item.key === key);
  const values = [[cell(key), cell(value), "string", "false", new Date().toISOString()]];

  if (!row) {
    await appendRow("Settings", [key, value, "string", "false", new Date().toISOString()]);
    return;
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: spreadsheetId(),
    range: `Settings!A${row._rowNumber}:E${row._rowNumber}`,
    valueInputOption: "RAW",
    requestBody: { values }
  });
}

export async function updateScheduleItem(id: string, time?: string, description?: string): Promise<void> {
  const sheets = await sheetsClient();
  const rows = await readSheetObjects("Schedule");
  const row = rows.find((item) => item.id === id);

  if (!row) {
    await appendRow("Schedule", [id, 999, id, time ?? "", description ?? "", "true"]);
    return;
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: spreadsheetId(),
    range: `Schedule!D${row._rowNumber}:E${row._rowNumber}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[cell(time ?? ""), cell(description ?? row.description)]]
    }
  });
}

export async function approveGuestbook(rowNumber: string, approved: boolean, displayedName?: string): Promise<void> {
  const sheets = await sheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId: spreadsheetId(),
    range: `Guestbook!F${rowNumber}:G${rowNumber}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[approved ? "true" : "false", cell(displayedName ?? "")]]
    }
  });
}

export async function appendAnalyticsRow(pageViews: number, rsvpStarted: number, rsvpCompleted: number): Promise<void> {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());

  await appendRow("Analytics", [today, pageViews, rsvpStarted, rsvpCompleted]);
}

export function isSheetConfigError(error: unknown): error is SheetConfigError {
  return error instanceof SheetConfigError;
}
