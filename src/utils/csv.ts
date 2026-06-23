import type { AdminRsvp } from "../types/wedding";

function quote(value: string | number | undefined): string {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export function rsvpsToCsv(rows: AdminRsvp[]): string {
  const header = [
    "createdAt",
    "fullName",
    "phone",
    "attendance",
    "guestCount",
    "accommodationNeed",
    "message",
    "songTitle",
    "songArtist"
  ];

  return [
    header.join(","),
    ...rows.map((row) =>
      [
        row.createdAt,
        row.fullName,
        row.phone,
        row.attendance,
        row.guestCount,
        row.accommodationNeed,
        row.message,
        row.songTitle,
        row.songArtist
      ]
        .map(quote)
        .join(",")
    )
  ].join("\n");
}

export function downloadTextFile(filename: string, text: string): void {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
