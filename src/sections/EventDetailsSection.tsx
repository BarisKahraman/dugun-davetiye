import { CalendarDays, Download, MapPin } from "lucide-react";
import { CalendarLinks } from "../components/CalendarLinks";
import { SectionHeading } from "../components/SectionHeading";
import { getFamilyLine } from "../config/wedding";
import type { WeddingConfig } from "../types/wedding";
import { formatTurkishDate } from "../utils/date";

type EventDetailsSectionProps = {
  config: WeddingConfig;
};

export function EventDetailsSection({ config }: EventDetailsSectionProps) {
  const familyLine = getFamilyLine(config);

  return (
    <section className="section section--details reveal" id="details" aria-labelledby="details-title">
      <div className="page-shell details-board">
        <div className="details-board__heading">
          <SectionHeading eyebrow="Düğün Bilgileri" title="Kısa ve Net" />
          <div className="details-board__paper-stack" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className="detail-grid detail-grid--pinboard">
          <article className="detail-card detail-card--date">
            <span className="detail-card__pin" aria-hidden="true" />
            <span className="detail-card__wash" aria-hidden="true" />
            <CalendarDays aria-hidden="true" size={24} />
            <h3>Tarih</h3>
            <p>{formatTurkishDate(config.event.date)}</p>
            {!config.event.startTime ? <span>Saat bilgileri yakında paylaşılacak.</span> : null}
          </article>
          <article className="detail-card detail-card--venue">
            <span className="detail-card__pin" aria-hidden="true" />
            <span className="detail-card__flower" aria-hidden="true" />
            <MapPin aria-hidden="true" size={24} />
            <h3>Mekân</h3>
            <p>{config.event.venueName}</p>
            <span>{config.event.address}</span>
          </article>
          <article className="detail-card detail-card--wide">
            <span className="detail-card__pin" aria-hidden="true" />
            <span className="detail-card__stamp" aria-hidden="true">NB</span>
            <h3>Davetiye</h3>
            {familyLine ? <p>{familyLine}</p> : <p>Göncü ve Kahraman aileleri sizleri bekliyor.</p>}
            <a className="button button--ghost" href="/davetiye.png" download="Nuray-Baris-Davetiye.png">
              <Download aria-hidden="true" size={18} />
              Davetiyeyi İndir
            </a>
          </article>
        </div>
        <CalendarLinks config={config} />
      </div>
    </section>
  );
}
