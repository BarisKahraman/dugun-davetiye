import { CalendarPlus } from "lucide-react";
import type { WeddingConfig } from "../types/wedding";
import { createCalendarLinks } from "../utils/calendar";

type CalendarLinksProps = {
  config: WeddingConfig;
  compact?: boolean;
};

export function CalendarLinks({ config, compact = false }: CalendarLinksProps) {
  const links = createCalendarLinks(config);

  if (!links) {
    return (
      <p className={compact ? "inline-note" : "muted-note"}>
        Saat bilgisi eklendiğinde takvim bağlantıları açılacak.
      </p>
    );
  }

  return (
    <div className={compact ? "calendar-links calendar-links--compact" : "calendar-links"}>
      <a className="button button--ghost" href={links.google} target="_blank" rel="noreferrer">
        <CalendarPlus aria-hidden="true" size={18} />
        Google Calendar
      </a>
      <a className="button button--ghost" href={links.appleIcs}>
        <CalendarPlus aria-hidden="true" size={18} />
        Apple / ICS
      </a>
      <a className="button button--ghost" href={links.outlook} target="_blank" rel="noreferrer">
        <CalendarPlus aria-hidden="true" size={18} />
        Outlook
      </a>
    </div>
  );
}
