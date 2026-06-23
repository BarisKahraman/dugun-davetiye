import { Camera, MapPin } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import type { WeddingConfig } from "../types/wedding";
import { getWeddingMode } from "../utils/date";
import { googleMapsUrl } from "../utils/maps";

type DynamicAreaSectionProps = {
  config: WeddingConfig;
};

export function DynamicAreaSection({ config }: DynamicAreaSectionProps) {
  const mode = getWeddingMode(config.event);

  if (mode === "before") {
    return null;
  }

  if (mode === "day") {
    return (
      <section className="section section--day reveal" aria-labelledby="day-title">
        <div className="page-shell day-band">
          <SectionHeading eyebrow="Bugün" title="Harita Elinizin Altında">
            Gecenin akışı ve mekân bağlantıları burada kalıyor.
          </SectionHeading>
          <a className="button button--primary" href={googleMapsUrl(config)} target="_blank" rel="noreferrer">
            <MapPin aria-hidden="true" size={18} />
            Haritaya Git
          </a>
          {config.gallery.uploadUrl ? (
            <a className="button button--ghost" href={config.gallery.uploadUrl} target="_blank" rel="noreferrer">
              <Camera aria-hidden="true" size={18} />
              Fotoğraf Yükle
            </a>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="section section--day reveal" aria-labelledby="thanks-title">
      <div className="page-shell day-band">
        <SectionHeading eyebrow="Teşekkürler" title={config.copy.postWeddingThanks} />
        {config.gallery.publicGalleryUrl ? (
          <a className="button button--primary" href={config.gallery.publicGalleryUrl} target="_blank" rel="noreferrer">
            <Camera aria-hidden="true" size={18} />
            Galeriyi Gör
          </a>
        ) : null}
      </div>
    </section>
  );
}
