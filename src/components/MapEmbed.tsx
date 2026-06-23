import { Map } from "lucide-react";
import { useState } from "react";
import type { WeddingConfig } from "../types/wedding";
import { googleMapEmbedUrl } from "../utils/maps";

type MapEmbedProps = {
  config: WeddingConfig;
};

export function MapEmbed({ config }: MapEmbedProps) {
  const [visible, setVisible] = useState(false);

  if (!visible) {
    return (
      <div className="map-placeholder">
        <Map aria-hidden="true" size={32} />
        <p>Haritayı yalnızca siz istediğinizde yüklüyoruz.</p>
        <button className="button button--primary" type="button" onClick={() => setVisible(true)}>
          Haritayı Göster
        </button>
      </div>
    );
  }

  return (
    <iframe
      className="map-frame"
      title={`${config.event.venueName} haritası`}
      src={googleMapEmbedUrl(config)}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}
