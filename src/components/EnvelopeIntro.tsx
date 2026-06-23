import { MailOpen } from "lucide-react";
import { Monogram } from "./Monogram";

type EnvelopeIntroProps = {
  opened: boolean;
  bride: string;
  groom: string;
  onOpen: () => void;
};

export function EnvelopeIntro({ opened, bride, groom, onOpen }: EnvelopeIntroProps) {
  return (
    <div className={opened ? "envelope-scene is-open" : "envelope-scene"} aria-hidden={opened}>
      <div className="envelope-scene__orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <button
        className="envelope-object"
        type="button"
        onClick={onOpen}
        disabled={opened}
        aria-label="Davetiyeyi aç"
      >
        <span className="envelope-object__shadow" aria-hidden="true" />
        <span className="envelope-object__card">
          <span className="envelope-object__stamp">ELMALI</span>
          <Monogram compact />
          <strong>
            {bride} <span>&amp;</span> {groom}
          </strong>
          <small>16 Ağustos 2026</small>
        </span>
        <span className="envelope-object__back" aria-hidden="true" />
        <span className="envelope-object__paper" aria-hidden="true" />
        <span className="envelope-object__flap" aria-hidden="true" />
        <span className="envelope-object__left" aria-hidden="true" />
        <span className="envelope-object__right" aria-hidden="true" />
        <span className="envelope-object__front" aria-hidden="true" />
      </button>
      <div className="envelope-scene__copy">
        <p className="eyebrow">Dijital davetiye</p>
        <h2>Zarfı açın, akşam başlasın.</h2>
        <p>Ufak bir tık. Sonrası Elmalı’da bir yaz akşamı.</p>
        <span className="button button--primary">
          <MailOpen aria-hidden="true" size={18} />
          Davetiyeyi Aç
        </span>
      </div>
    </div>
  );
}
