import { ExternalLink, MapPin } from "lucide-react";
import { CopyButton } from "../components/CopyButton";
import { MapEmbed } from "../components/MapEmbed";
import { SectionHeading } from "../components/SectionHeading";
import type { WeddingConfig } from "../types/wedding";
import { appleMapsUrl, googleMapsUrl } from "../utils/maps";

type VenueSectionProps = {
  config: WeddingConfig;
};

export function VenueSection({ config }: VenueSectionProps) {
  return (
    <section className="section reveal" id="venue" aria-labelledby="venue-title">
      <div className="page-shell venue-grid">
        <div>
          <SectionHeading eyebrow="Mekân" title={config.event.venueName}>
            {config.event.address}
          </SectionHeading>
          <div className="button-row">
            <a className="button button--primary" href={googleMapsUrl(config)} target="_blank" rel="noreferrer">
              <MapPin aria-hidden="true" size={18} />
              Google Maps
            </a>
            <a className="button button--ghost" href={appleMapsUrl(config)} target="_blank" rel="noreferrer">
              <ExternalLink aria-hidden="true" size={18} />
              Apple Maps
            </a>
            <CopyButton value={`${config.event.venueName}, ${config.event.address}`} label="Adresi Kopyala" />
          </div>
        </div>
        <MapEmbed config={config} />
      </div>
    </section>
  );
}
