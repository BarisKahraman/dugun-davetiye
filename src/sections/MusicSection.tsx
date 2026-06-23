import { Music2 } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import type { WeddingConfig } from "../types/wedding";

type MusicSectionProps = {
  config: WeddingConfig;
};

export function MusicSection({ config }: MusicSectionProps) {
  return (
    <section className="section reveal" id="music" aria-labelledby="music-title">
      <div className="page-shell music-band">
        <Music2 aria-hidden="true" size={30} />
        <SectionHeading title="Bir Şarkı Bırakın">
          O gece dans pistinin hafızasını birlikte yapalım. Bizim listede şimdilik{" "}
          <strong>{config.music.preferredSong}</strong> var.
        </SectionHeading>
        <a className="button button--ghost" href="#rsvp">
          Şarkı Öner
        </a>
      </div>
    </section>
  );
}
