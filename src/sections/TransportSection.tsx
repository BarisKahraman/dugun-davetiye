import { Navigation } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import type { WeddingConfig } from "../types/wedding";
import { googleMapsUrl } from "../utils/maps";

type TransportSectionProps = {
  config: WeddingConfig;
};

export function TransportSection({ config }: TransportSectionProps) {
  return (
    <section className="section section--sky reveal" aria-labelledby="transport-title">
      <div className="page-shell transport-band">
        <Navigation aria-hidden="true" size={28} />
        <SectionHeading title="Ulaşım">
          Özel servis planlanmıyor. Mekâna ulaşmak için harita bağlantılarını kullanabilirsiniz.
        </SectionHeading>
        {config.transport.parkingInfo ? <p>{config.transport.parkingInfo}</p> : null}
        <a className="button button--ghost" href={googleMapsUrl(config)} target="_blank" rel="noreferrer">
          Haritaya Git
        </a>
      </div>
    </section>
  );
}
